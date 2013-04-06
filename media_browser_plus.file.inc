<?php
/**
 * @file
 * File entity specific hooks.
 */

/**
 * Implements hook_field_attach_presave().
 */
function media_browser_plus_file_presave($entity) {
  // Set appropriate default folder if necessary.
  if (empty($entity->field_folder[LANGUAGE_NONE][0]['tid'])) {
    $root = media_browser_plus_get_media_root_folder();
    $entity->field_folder[LANGUAGE_NONE] = array(array('tid' => $root->tid));
  }
}
