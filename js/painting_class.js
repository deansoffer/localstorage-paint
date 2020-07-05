var previewCanvasHeight = 150;
var previewCanvasWidth = 250;
var localStoragePrefix = "painting_";

window.Painting = class Painting {

  /**
   * clear all paintings in localstorage
   */
  static clearAll(){
    localStorage.clear();
  }

  /**
   * load painting list to element
   * @param loadToElementID
   */
  static showPaintingList(loadToElementID) {
    $(loadToElementID).empty();
    let list = Painting.getPaintingsList();
    if(list.length<1){
      $(loadToElementID).html('You don\'t have any paintings yet, please add some by clicking "New Painting" button');
      $("#edit_instructions").hide();
      $("#clearAllPaintings").hide();
    }
    for (let i = 0; i < list.length; i++) {

      // container element
      let d = document.createElement('div');
      d.id = "painting_" + list[i];

      // painting name span
      let s = document.createElement('span');
      s.classList.add = "painting-name";
      s.innerHTML = list[i];

      // delete Button
      let b = document.createElement('button');
      b.innerHTML = "Delete";
      $(b).attr('data-pid', i);
      $(b).click(function (e) {
        if (confirm('Lo Haval Kaze Yofi Shel Painting?')) {
          let paintingID = e.target.dataset['pid'];
          Painting.removePainting(paintingID);
          Painting.showPaintingList(loadToElementID);
          showSysMessage('Painting Deleted! kama Haval!')
        }
      })

      // canvas Element
      let c = document.createElement('canvas');
      c.height = previewCanvasHeight;
      c.width = previewCanvasWidth;
      Painting.loadPainting(list[i], c,true);

      // append all together
      d.append(s);
      d.append(b);
      d.append(c);
      $(loadToElementID).append(d);
    }

  }

  /**
   * save painting list array to local storage
   * @param list
   */
  static setPaintingsList(list) {
    localStorage.setItem('paintings', JSON.stringify(list));
  }

  /**
   * deletes painting by index
   * @param paintingIndex
   */
  static removePainting(paintingIndex) {
    let list = Painting.getPaintingsList();
    let paintingName = list[paintingIndex]
    localStorage.removeItem(localStoragePrefix + paintingName);
    console.log('deleting', paintingIndex);
    list.splice(paintingIndex, 1)
    Painting.setPaintingsList(list);
  }

  /**
  * return painitng list array or empty array if not defined
   */
  static getPaintingsList() {
    let list = JSON.parse(localStorage.getItem('paintings'));
    return list == null ? [] : list;
  }

  /**
   * save new painitng or override existing one
   * @param paintingName
   * @param canvas object
   */
  static savePainting(paintingName, canvasObject, isNew = true) {
    let plist = Painting.getPaintingsList();

    localStorage.setItem(localStoragePrefix + paintingName, canvasObject.toDataURL());

    if (isNew)
      plist.push(paintingName)

    Painting.setPaintingsList(plist);
    showSysMessage('Yaalaa We Saved Your Painting, you can view and edit it at any time from main screen')
  }

  /**
   * load existing painting to canvas
   * resize - true : scale to fit canvas dimensions
   * @param paintingName
   * @param canvas
   * @param resize
   */
  static loadPainting(paintingName, canvas, resize = false) {

    var ctx = canvas.getContext('2d');
    var dataURL = localStorage.getItem(localStoragePrefix + paintingName);
    var img = new Image;
    img.src = dataURL;
    img.onload = function () {

      if (resize) {
        ctx.drawImage(img, 0, 0, previewCanvasWidth, previewCanvasHeight * img.height / img.width); // scale imagedata to fit canvas
      } else {
        ctx.drawImage(img, 0, 0);
      }
    };
  }
}
