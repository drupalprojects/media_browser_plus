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

  // No add our own stuff - based on the set options.
  /*$handler = $vars['view']->style_plugin;
  $handler->options['type'];*/
  // Add folder column.
}

/**
 * Implements hook_views_invalidate_cache().
 */
function media_browser_plus_views_invalidate_cache() {
  cache_clear_all('media:browser:plus:plugin', 'cache', TRUE);
  drupal_static_reset('media_browser_plus_get_browser_plugin_info');
}
