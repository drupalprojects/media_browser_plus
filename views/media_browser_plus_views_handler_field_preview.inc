<?php

/**
 * @file
 * The media browser plus field handler.
 */

/**
 * Field handler for the media browser plus.
 *
 * @ingroup views_field_handlers
 */
class media_browser_plus_views_handler_field_preview extends views_handler_field {

  public function render($values) {
    $file = file_load($values->fid);
    $preview = media_get_thumbnail_preview($file);
    return drupal_render($preview);
  }
}
