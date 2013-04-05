<?php

/**
 * @file
 * Provide Views data and handlers for media.module
 */

/**
 * Implements hook_views_plugins().
 *
 * Generate a list of which base-tables to enabled the plugins for.
 */
function media_browser_plus_views_plugins() {
  $plugins = array();

  // Always allow the actual file-table
  $base = array('file_managed');

  if (module_exists('search_api')) {
    // If the Search API module exists, also allow indices of the file-entity
    // that has the fid field indexed.
    $indices = search_api_index_load_multiple(NULL);
    foreach ($indices as $machine_name => $index) {
      if ($index->item_type == 'file' && isset($index->options['fields']['fid'])) {
        $base[] = 'search_api_index_' . $machine_name;
      }
    }
  }

  // Style plugin.
  $plugins['style']['media_browser_plus'] = array(
    'title' => t('Media browser plus'),
    'help' => t('Displays rows as an HTML list including the folder management.'),
    'handler' => 'media_browser_plus_views_plugin_style_media_browser',
    'theme' => 'media_browser_plus_views_view_media_browser',
    'base' => $base,
    'uses row plugin' => FALSE,
    'uses row class' => FALSE,
    'uses options' => TRUE,
    'uses fields' => FALSE,
    'type' => 'normal',
    'help topic' => 'style-media-browser',
  );
  return $plugins;
}

/**
 * Display the view as a media browser.
 */
function template_preprocess_media_browser_plus_views_view_media_browser(&$vars) {
  module_load_include('inc', 'media', 'includes/media.browser');

  // Do whatever media itself does.
  template_preprocess_media_views_view_media_browser($vars);

  $view = $vars['view'];

  // Now add our own stuff - based on the set options.
  // Add the js / css library.
  drupal_add_library('media_browser_plus', 'media_browser_plus');

  // Add more information for the JS integration.
  $vars['options']['view_id'] = $view->name;
  $vars['options']['view_display_id'] = $view->current_display;

  // Fetch folder filter.
  if ($view->filter) {
    foreach ($view->filter as $filter) {
      if ($filter->is_exposed() && $filter->real_field == 'field_folder_tid') {
        $vars['options']['folder_filter_id'] = $filter->options['expose']['identifier'];
      }
    }
  }

  // Add settings for the js library.
  drupal_add_js(array(
    'mbp' => array(
      'views' => array(
        $view->name . ':' . $view->current_display => $vars['options'],
      ),
    )),
    'setting'
  );

  // Add folders view.
  // @todo should this be configurable?
  $vars['folders'] = NULL;
  if (!empty($vars['options']['show_folders'])) {
    $vars['folders'] = views_embed_view('media_browser_plus_folders');
  }
}

/**
 * Implements hook_views_invalidate_cache().
 */
function media_browser_plus_views_invalidate_cache() {
  cache_clear_all('media:browser:plus:plugin', 'cache', TRUE);
  drupal_static_reset('media_browser_plus_get_browser_plugin_info');
}
