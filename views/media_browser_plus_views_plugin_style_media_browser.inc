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

    $options['items_draggable'] = array('default' => TRUE);
    $options['show_media_basket'] = array('default' => TRUE);

    return $options;
  }

  /**
   * Render the given style.
   */
  function options_form(&$form, &$form_state) {
    // parent::options_form($form, $form_state);

    $form['items_draggable'] = array(
      '#type' => 'checkbox',
      '#title' => t('Enable drag and drop'),
      '#default_value' => $this->options['items_draggable'],
    );

    $form['show_media_basket'] = array(
      '#type' => 'checkbox',
      '#title' => t('Enable media basket'),
      '#default_value' => $this->options['items_draggable'],
    );
  }
}
