(function ($) {
  Drupal.behaviors.media_browser_menu = {
    attach: function (context) {
      // append links
      var $filterLink = "";
      if(Drupal.settings.media_browser_plus.filter_active)
        $filterLink = $('<a href="' + Drupal.settings.media_browser_plus.url + '?q=admin/content/media/filter"></a>').html('Change <b>(active)</b> Filter');
      else
        $filterLink = $('<a href="' + Drupal.settings.media_browser_plus.url + '?q=admin/content/media/filter"></a>').html('Apply Filter');
      $('ul.action-links', context).append($('<li></li>').append($filterLink));
      var $settingsLink = $('<a href="' + Drupal.settings.media_browser_plus.url + '?q=admin/content/media/settings"></a>').html('Media Settings');
      $('ul.action-links', context).append($('<li></li>').append($settingsLink));
    }
  }
})(jQuery);