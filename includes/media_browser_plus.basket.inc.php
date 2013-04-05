<?php
/**
 * @file
 * Functions for the media basket feature.
 */

/**
 * Appends the media basket.
 */
function media_browser_plus_media_basket_form($library_mode = FALSE, &$form_state = array()) {
  $header = array(array('data' => t('Media Basket')));
  $form['basket_actions'] = array();
  $form['basket_actions']['selection_assets'] = array(
    '#type' => 'markup',
    '#markup' => '<a href="#media_basket_table" id="media_basket_remove_all" >' . t('Remove All') . '</a>',
  );

  if ($library_mode) {
    $form['basket_actions']['select'] = array(
      '#type' => 'submit',
      '#value' => t('Continue with Selection'),
      '#attributes' => array('id' => 'proceed_with_select'),
      '#limit_validation_errors' => array(),
      '#validate' => array('media_browser_plus_file_entity_admin_files_validate'),
    );
  }
  else {
    if (media_browser_plus_access('download media')) {
      $form['basket_actions']['download'] = array(
        '#type' => 'submit',
        '#value' => t('Download'),
        '#attributes' => array('id' => 'perform_download'),
        '#limit_validation_errors' => array(),
        '#validate' => array('media_browser_plus_file_entity_admin_files_validate'),
        '#submit' => array('media_browser_plus_download_images_submit'),
      );
    }
  }

  $options = array(array(
    'media' => array(
      'data' => '<ul id="media-basket-list" class="media-list-thumbnails"></ul>'),
    ),
    array(
      'media' => array(
        'data' => drupal_render($form['basket_actions']),
        'id' => array('media_browser_plus_basket_panel'),
      ),
    ),
  );

  $table = array(
    'header' => $header,
    'rows' => $options,
    'attributes' => array(
      'id' => 'media_basket_table',
      'class' => array('mbp-item-list'),
    ),
    'empty' => t('No media added yet.'),
  );
  return array(
    '#type' => 'markup',
    '#markup' => theme('table', $table),
    'basket_actions' => $form['basket_actions'],
  );
}
