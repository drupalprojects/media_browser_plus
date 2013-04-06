<?php

/**
 * @file
 * The media browser plus style plugin.
 */

/**
 * Media Browser Plus Views style plugin.
 *
 * Style plugin to render media items as an interactive grid for the media
 * browser plus.
 *
 * @ingroup views_style_plugins
 */
class media_browser_plus_views_plugin_style_media_browser extends media_views_plugin_style_media_browser {

  /**
   * Set default options.
   */
  function option_definition() {
    $options = parent::option_definition();

    $options['show_folders'] = array('default' => TRUE);
    $options['files_draggable'] = array('default' => TRUE);
    $options['folders_draggable'] = array('default' => TRUE);
    $options['show_media_basket'] = array('default' => TRUE);

    return $options;
  }

  /**
   * Always render this style to ensure the additions are displayed.
   */
  function even_empty() {
    return TRUE;
  }

  /**
   * Render the given style.
   */
  function options_form(&$form, &$form_state) {
    // parent::options_form($form, $form_state);

    // @todo Add folder management and enable once it's available.
//    $form['files_draggable'] = array(
//      '#type' => 'checkbox',
//      '#title' => t('Enable drag and drop for files'),
//      '#default_value' => $this->options['files_draggable'],
//    );
    $form['folders_draggable'] = array(
      '#type' => 'checkbox',
      '#title' => t('Enable drag and drop for folders'),
      '#default_value' => $this->options['folders_draggable'],
    );
    $form['show_media_basket'] = array(
      '#type' => 'checkbox',
      '#title' => t('Enable media basket'),
      '#default_value' => $this->options['items_draggable'],
    );
  }
}
