/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 * http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
 */
;(function ( $, window, document, undefined ) {
  // Create the defaults once
  var pluginName = 'mbp',
    defaults = {
      folderManagementEnabled: false,
      fileIdRegexp: /^.*media-item-([0-9]*).*$/,
      folderIdRegexp: /^.*folder-id-([0-9]*).*$/,
      mbpActionRegexp: /^.*mbp-action-(.*?)( .*|)$/,
      actions: {}
    };

  // The actual plugin constructor
  function MBP( element, options ) {
    var plugin = this;
    this.element = $(element);
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;

    // Add static methods.

    this.removeItemFromBasket = function(item) {
      // Extract file id and store it - in cookie and exposed form.
      var file_id = this.id.replace(plugin.options.fileIdRegexp, '$1');
      plugin.element.find('input[name=mbp_basket_files]').val(plugin.element.find('input[name=mbp_basket_files]').val().replace(file_id, '').replace('  ', ' '));
      $.cookie('Drupal.visitor.mbp.basket', plugin.element.find('input[name=mbp_basket_files]').val());
      $(this).remove();
    };

    this.addItemToBasked = function (item) {
      if (!plugin.element.find('.mbp-file-basket-list').find('#' + item.id).length) {
        // Extract file id and store it - in cookie and exposed form.
        var file_id = item.id.replace(plugin.options.fileIdRegexp, '$1');
        plugin.element.find('input[name=mbp_basket_files]').val(plugin.element.find('input[name=mbp_basket_files]').val() + ' ' + file_id);
        $.cookie('Drupal.visitor.mbp.basket', plugin.element.find('input[name=mbp_basket_files]').val());
        plugin.element.find('.mbp-file-basket-list').append(item);
        $(item)
          .click(plugin.removeItemFromBasket)
          .find('a').click(function(e) {
            e.preventDefault();
          });
      }
    }

    this.init();
  }

  MBP.prototype.init = function () {
    var plugin = this;
    this.element.find('.mbp-folders li').bind('click.mbp', function(e) {
      // A click on the icon just opens the folder structure.
      if (!$(e.target).hasClass('icon')) {
        plugin.loadFiles($(this).children('div.folder-name').attr('class').replace(plugin.options.folderIdRegexp, '$1'));
      }
      else {
        if ($(this).hasClass('open')) {
          plugin.folderClose($(this));
        }
        else {
          plugin.folderOpen($(this));
        }
      }
      e.stopPropagation();
    });

    // Hide exposed folder filter.
    this.element.find('div.form-item-mbp-current-folder:has(:input[name=mbp_current_folder])').hide();
    // Initialize the folder structure.
    var currentFolder = this.element.find(':input[name=mbp_current_folder]').val();
    if (currentFolder) {
      this.element
        .find('li:has(>.folder-id-' + currentFolder + ')').addClass('active')
        .find('ol:first').show();
      var folder = this.element.find('.folder-id-' + currentFolder).show();
      folder.parents('ol').show();
      folder.parents('li').addClass('open');
    }

    // Enable drag n drop.
    if (this.options.files_draggable) {
      this.element.find('.mbp-file-list li').draggable({
        iframeFix: true,
        opacity: 0.7,
        revert: 'invalid',
        zIndex: 999,
        helper: function(){
          // Support grouping of draggables.
          var selected = plugin.element.find('li:has(input.vbo-select:checked)');
          if (selected.length === 0) {
            selected = $(this);
          }
          var container = $('<div/>').attr('id', 'draggingContainer');
          container.append(selected.clone());
          return container;
        }
      });
    }
    // @todo Add folder management.
    if (this.options.folders_draggable) {
//      this.element.find('.mbp-folders li').draggable({
//        iframeFix: true,
//        opacity: 0.7,
//        revert: 'invalid'
//      });
    }
    if (this.options.files_draggable || this.options.folders_draggable) {
      this.element.find('.mbp-folders li div.folder-name').droppable({
        hoverClass: 'drag-hover',
        tolerance: 'pointer',
        drop: function(event, ui) {
          if (ui.helper.data('mbpDragHoverTimeout')) {
            window.clearTimeout(ui.helper.data('mbpDragHoverTimeout'));
          }
          var target = $(this);
          var folder_id = target.attr('class').replace(plugin.options.folderIdRegexp, '$1');
          // Since we support grouping of draggables iterate over each item.
          ui.helper.find('li').each(function(index, item){
            item = $(item);
            var file_id = item.attr('id').replace(plugin.options.fileIdRegexp, '$1');
            var url = Drupal.settings.basePath + 'admin/content/file/' + file_id + '/move-to-folder/' + folder_id;
            // Add throbber to folder.
            target.prepend('<div class="ajax-progress ajax-progress-throbber media-item-' + file_id + '"><div class="throbber">&nbsp;</div></div>');
            plugin.element.find('#' + item.attr('id')).remove();
            $.ajax({
              url: url,
              success: function(data) {
                target.find('.ajax-progress.media-item-' + file_id).remove();
              },
              error: function(data) {
                alert(Drupal.t('An error occured, please refresh the page and try again.'));
                target.find('.ajax-progress.media-item-' + file_id).remove();
              }
            });
          });
        },
        over: function(event, ui) {
          // Open subfolder after 1 second hovering.
          if (ui.helper.data('mbpDragHoverTimeout')) {
            window.clearTimeout(ui.helper.data('mbpDragHoverTimeout'));
          }
          var target = $(this);
          ui.helper.data('mbpDragHoverTimeout', window.setTimeout(function(){
            //@todo Figure out why subfolders aren't initialized droppables.
            plugin.folderOpen(target.parent());
          }, 1000));
        },
        out: function(event, ui ) {
          if (ui.helper.data('mbpDragHoverTimeout')) {
            window.clearTimeout(ui.helper.data('mbpDragHoverTimeout'));
            ui.helper.data('mbpDragHoverTimeout', false);
          }
        }
      });
    }

    // Make media basked.
    if (this.options.media_basket ) {
      this.element.find('.mbp-file-basket-list li')
        .click(this.removeItemFromBasket);
      this.element.find('.mbp-file-basket input[name=mbp_basket_files_download]').click(function() {
        window.setTimeout(function(){
          plugin.element.find('.mbp-file-basket-list li').trigger('click');
        }, 1000);
        window.location.href = Drupal.settings.basePath + Drupal.settings.pathPrefix + 'admin/content/file/download-multiple/' + plugin.element.find('input[name=mbp_basket_files]').val();
      });

      if (this.options.files_draggable) {
        this.element.find('.mbp-file-basket').droppable({
          hoverClass: 'drag-hover',
          drop: function(event, ui) {
            var target = $(this);
            ui.helper.find('li').each(function(index, item){
              plugin.addItemToBasked(item);
            });
          }
        });
      }
    }

    // Hide the vbo checkboxes and handle them by JS.
    this.element.find('.mbp-file-list li:has(.vbo-select)')
      .bind('click.mbp', function(e) {
        if (!$(e.target).hasClass('vbo-select')) {
          $(this).find('input.vbo-select')
            .attr('checked', !$(this).find('input.vbo-select').attr('checked'))
            .trigger('change');
        }
      });
    this.element.find('.mbp-file-list li input.vbo-select')
      .bind('change.mbp', function(e) {
        var media_item = plugin.element.find('#media-item-' + this.value + ' .media-item');
        if (this.checked) {
          media_item.addClass('selected');
        }
        else {
          media_item.removeClass('selected');
        }
      })
      .hide();
    $('.vbo-select-this-page', this.element).click(function() {
      $('input.vbo-select', this.element)
        .attr('checked', this.checked)
        .trigger('change');
    });
    $('.vbo-select-all-pages', this.element).click(function() {
      $('input.vbo-select', this.element)
        .attr('checked', this.checked)
        .trigger('change');
    });
    // If there are links and vbo selects navigate only on dbl clicks.
    this.element.find('.mbp-file-list li:has(.vbo-select):has(a)')
      .bind('dblclick.mbp', function(e) {
        window.location.href = $(this).find('a').attr('href');
      })
      .find('a').bind('click.mbp', function(e) {
        e.preventDefault();
      });

    // Register actions
    for (var action in this.options.actions) {
      if (this[action + 'Files']) {
        this.element.find('.mbp-action-' + action).bind('click.mbp',function() {
          var action = $(this).attr('class').replace(plugin.options.mbpActionRegexp, '$1');
          plugin[action + 'Files']();
        });
      }
    }
  };

  MBP.prototype.destroy = function () {
    this.element.find('.mbp-folders li')
      .unbind('.mbp')
      .draggable('destroy')
      .droppable('destroy');
    this.element.find('.mbp-file-list li')
      .unbind('.mbp')
      .draggable('destroy')
      .find('input.vbo-select')
      .unbind('.mbp')
      .show();
    this.element.find('div.views-exposed-widget:has(:input[name=mbp_current_folder])').show();
    this.element.find('.mbp-action-').unbind('.mbp');
  };

  MBP.prototype.folderOpen = function(folder) {
    $(folder)
      .addClass('open')
      .find('ol:first').show();
  }

  MBP.prototype.folderClose = function(folder) {
    $(folder)
      .removeClass('open')
      .find('ol').hide();
  }

  // Loads the files of a folder.
  MBP.prototype.loadFiles = function(folder_id) {
    if (this.element.find(':input[name=mbp_current_folder]').length && this.element.find(':input[name=mbp_current_folder]').val() != folder_id) {
      this.element.find(':input[name=mbp_current_folder]').val(folder_id).trigger('change');
      this.element.find('li.active').removeClass('active');
      this.element.find('li:has(>.folder-id-' + folder_id + ')')
        .addClass('active')
        .prepend('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
    }
  }

  MBP.prototype.getSelectedFiles = function () {
    var fids = [];
    var plugin = this;
    this.element.find('.mbp-file-list li:has(.media-item.selected)').each(function(i, item) {
      fids.push(item.id.replace(plugin.options.fileIdRegexp, '$1'));
    });
    return fids;
  }

  MBP.prototype.deleteFiles = function () {
    var fids = this.getSelectedFiles();
    if (fids.length) {
      window.location.href = Drupal.settings.basePath + Drupal.settings.pathPrefix + 'admin/content/file/delete-multiple/' + fids.join(' ');
    }
  }

  MBP.prototype.basketFiles = function () {
    var plugin = this;
    var items = this.element.find('.mbp-file-list li:has(.media-item.selected)')
    if (items.length) {
      items.each(function(index, item) {
        plugin.addItemToBasked(item);
      });
    }
  }

  MBP.prototype.editFiles = function () {
    var fids = this.getSelectedFiles();
    if (fids.length) {
      window.location.href = Drupal.settings.basePath + Drupal.settings.pathPrefix + 'admin/content/file/edit-multiple/' + fids.join(' ');
    }
  }

  MBP.prototype.downloadFiles = function () {
    var fids = this.getSelectedFiles();
    if (fids.length) {
      window.location.href = Drupal.settings.basePath + Drupal.settings.pathPrefix + 'admin/content/file/download-multiple/' + fids.join(' ');
    }
  }

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new MBP( this, options ));
      }
      else {
        if (options == 'options') {
          return $.data(this, 'plugin_' + pluginName).options;
        }
      }
    });
  }

  Drupal.behaviors.media_browser_plus_views = {
    attach: function (context) {
      if (Drupal.settings.mbp.views) {
        for(var i in Drupal.settings.mbp.views) {
          var view_id = Drupal.settings.mbp.views[i].view_id;
          var view_display_id = Drupal.settings.mbp.views[i].view_display_id;
          $('.view-id-'  + view_id + '.view-display-id-' + view_display_id).mbp(Drupal.settings.mbp.views[i]);
        }
      }
    }
  }

})( jQuery, window, document );
