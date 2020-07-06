/**
 * written by Dean Soffer
 * Computer Engineering | 3rd year
 * Client Side Course
 * used tech in this file: vanilla js(es5), jquery, html canvas api, local storage
 */


var editPainting = null;
window.showSysMessage = function (msg, type = 'success') {
  if (type == 'error') {
    $("#sysmsg").addClass('error');
  } else {
    $("#sysmsg").removeClass('error');
  }
  $("#sysmsg").html(msg).fadeIn().delay(6000).fadeOut();
  ;
}

$(document).ready(function () {

  // hide app loader
  $('.app-loader').fadeOut('fast');

  $('#recent-paintings > div').click(function () {

    if ($(this).hasClass('selected')) {

      // set classes
      $('#recent-paintings > div').removeClass('selected');
      $('#bEditPainting').addClass('disabled');
      $(this).removeClass('selected');

      // set edit painting
      editPainting = null;
      localStorage.removeItem('editPainting');

    } else {
      // set classes
      $('#recent-paintings  div').removeClass('selected');
      $(this).addClass('selected');
      $('#bEditPainting').removeClass('disabled');

      // set edit painting
      editPainting = this.id.split('_')[1];
      localStorage.setItem('editPainting', editPainting);
    }

  });

  $('#bEditPainting').click(function () {
    if (!editPainting) {
      showSysMessage('Please Select Painting to Edit First', 'error')
      return;
    }
    window.location = "paint.html";
  });


  $('#bNewPainting').click(function () {
    localStorage.removeItem('editPainting');
  });

  $('#clearAllPaintings').click(function () {
    if (confirm('Clear All Paintings?')) {
      Painting.clearAll();
      Painting.showPaintingList('#recent-paintings');
      showSysMessage('All Paintings Cleared')
    }

  });
})







