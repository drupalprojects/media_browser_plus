<?php
/**
 * @file media-views-view-media-browser.tpl.php
 * View template to display a grid of media previews in the media browser.
 *
 * @see views-view-list.tpl.php
 * @see template_preprocess_media_views_view_media_browser()
 * @ingroup views_templates
 */
?>

<?php print $wrapper_prefix; ?>
<div class="clearfix">
<?php if(!empty($folders)) : ?>
<div class="mbp-folders">
  <?php print $folders ?>
</div>
<?php endif; ?>
  <div class="mbp-file-list">
    <?php print $list_type_prefix; ?>
      <?php foreach ($rows as $id => $row): ?>
        <li id="media-item-<?php print $view->result[$id]->fid; ?>" class="<?php print $classes_array[$id]; ?>">
          <?php print $row; ?>
        </li>
      <?php endforeach; ?>
    <?php print $list_type_suffix; ?>
    <div id="status"></div>
  </div>
</div>
<?php print $wrapper_suffix; ?>
