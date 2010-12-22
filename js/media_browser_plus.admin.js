(function ($) {
  Drupal.behaviors.media_browser_folders = {
    attach: function (context) {
      var gallery = $('.media-list-thumbnails');
      // Let the gallery items be draggable
      $( "li", gallery ).draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document", // stick to table
        helper: "clone",
        cursor: "move"
      });
      // Load active folder
      Drupal.behaviors.media_browser_folders.loadFolderContents($("div.folder_load:first"), 0);
      $("div.folder_load:first").addClass('selectedFolder');
      // Bind click handlers.
      // toggle the display of subfolders
      $( "div.folder-children-toggle" ).bind('click', Drupal.behaviors.media_browser_folders.toggleSubfolders);
      // folder content loading:
      $('div.folder_load').bind('click', function( event ) {
        // grab item
        var $item = $(this);
        // and load contents
        Drupal.behaviors.media_browser_folders.loadFolderContents($item, 0);
        return false;
      });
      $("div.folder_load" ).not('#folder_load_0').droppable({
        accept: ".media-list-thumbnails > li",
        drop: Drupal.behaviors.media_browser_folders.moveImage,
        over: function (event, ui) {
          $(this).toggleClass('dragOverDrop');
        },
        out: function (event, ui) {
          $(this).toggleClass('dragOverDrop');
        }
      });
    },
    // function which moves an image into a new folder
    moveImage : function (event , ui) {
      var folder = $(this);
      if (folder.hasClass('selectedFolder')) {
        return;
      }
      var item = ui.draggable;
      // every image has an hidden input with its id inside its <li> tag
      var id = item.attr('fid');
      // remove the hover media over folder class
      folder.removeClass('dragOverDrop');
      folder.removeClass('emptyFolder');
      folder.parent().children(":first-child").removeClass("emptyParent");
      folder.parent().children(":first-child").removeClass("empty");
      // look if old folder is now empty
      // send the change media folder request
      // @TODO: think about some success/error UI Feedback
      $.post(Drupal.settings.media_browser_plus.url + "?q=admin/content/media/change_category", {media: id, folder: folder.attr('id')});
      // remove item from gallery
      item.addClass("movedImage");
      item.fadeOut();
      if($('.media-list-thumbnails > li:not(.movedImage)').length - 1 == 0){
          var oldFolder = $('div.selectedFolder');
          oldFolder.addClass('emptyFolder');
          if(folder.parent().children(":first-child").hasClass("emptyParent")){
            oldFolder.parent().children(":first-child").addClass("emptyParent");
          } else {
            oldFolder.parent().children(":first-child").addClass("empty");
          }
        }
    },
    loadFolderContents: function ($item, $page) {
      // check against double loading of the same folder
      if($item.hasClass('selectedFolder') && $page == Drupal.settings.media_browser_plus.page) {
        return;
      }
      $('.selectedFolder').removeClass('selectedFolder');
      // Set folder as new active folder and set new page
      $item.addClass('selectedFolder');
      // Remove old pictures.
      $(".media-list-thumbnails > li").remove();
      // @TODO: add some kind of loading UI and failure handling here
      // and load in new ones
      $.post(Drupal.settings.media_browser_plus.url + "?q=admin/content/media/thumbnailsJSON", {folder: $item.attr('id'), page : $page}, Drupal.behaviors.media_browser_folders.folderContentsLoaded);
      // redo the pages menu
      Drupal.settings.media_browser_plus.page = $page;
    },
    addPageItem: function ($folder, $page, $title) {
      $page_item = '<div class="media_paging_page';
      if(Drupal.settings.media_browser_plus.page == $page)
        $page_item += " active_page";
      $page_item += '">' + $title + '</div>';
      $page_item = $($page_item);
      $page_item.bind('click', function( event ) {
        // load the selected page
        Drupal.behaviors.media_browser_folders.loadFolderContents($folder, $page);
        return false;
      });
      // append the item
      $('#media_browser_plus_pages').append($page_item);
    },
    folderContentsLoaded: function (data) {
      var $results_count = 0;
      var $overall_count = 0;
      var $folder = "";
      jQuery(data).each(function(index){
      // grab item
      var $item = $(this);
      // append it to the gallery and do a fadein
      if($item.attr('id') == 'result_count') {
        $results_count = $item.html();
      } else if($item.attr('id') == 'overall_count') {
        $overall_count = $item.html();
      } else if($item.attr('id') == 'folder_loaded') {
        $folder = $("#" + $item.html());
      } else {
        $item.prependTo('.media-list-thumbnails');
        // make it draggable
        $item.draggable({
          cancel: "a.ui-icon", // clicking an icon won't initiate dragging
          revert: "invalid", // when not dropped, the item will revert back to its initial position
          containment: "document", // stick to demo-frame if present
          helper: "clone",
          cursor: "move"
        });
      }
      });
      // handle paging menu:
      $('#media_browser_plus_pages').html('');
      var $pages = Math.ceil($overall_count / Drupal.settings.media_browser_plus.per_page);
      var $start = Math.max(0, Drupal.settings.media_browser_plus.page - Math.ceil(Drupal.settings.media_browser_plus.page_items_per_page / 2));
      var $end = Math.min($pages, $start + Drupal.settings.media_browser_plus.page_items_per_page);
      if($start > 0){
        Drupal.behaviors.media_browser_folders.addPageItem($folder, $start-1, "...");
      }
      // create numbers
      if($pages > 1)
        for($i = $start; $i < $end; $i++){
          Drupal.behaviors.media_browser_folders.addPageItem($folder, $i, $i + 1);
        }
      // append one extra to show that there are more pages
      if($pages > $i){
        Drupal.behaviors.media_browser_folders.addPageItem($folder, $i, "...");
      }
    },
    toggleSubfolders: function (event) {
      // Grab folder.
      var $item = $(this);
      // Toggle the display of its <ul> elements.
      $item.parent().children('ul').toggleClass('hidden');
      return false;
    }
  };
})(jQuery);