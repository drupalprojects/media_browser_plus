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
class media_browser_plus_views_handler_field_preview_vbo extends views_bulk_operations_handler_field_operations {

  public function pre_render(&$values) {

  }

  public function render($values) {
    $output = parent::render($values);
    $file = file_load($values->fid);
    $preview = media_get_thumbnail_preview($file);
    $output .= drupal_render($preview);
    return $output;
  }
}
