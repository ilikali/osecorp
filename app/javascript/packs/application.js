require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")
require("jquery")
require("stylesheets/application.scss")

import Sketch from './sketch';


$(document).ready(function() {
  new Sketch({
      dom: document.querySelector('.canvas_holder'),
      showLoader: true
  });
})
