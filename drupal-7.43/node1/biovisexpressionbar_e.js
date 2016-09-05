var jQuery = require('jquery');
var d3 = require('d3');
var science = require('science');
var colorbrewer = require('colorbrewer');
// load everything 
//require('jquery-ui/sortable');
//require('jquery-ui/tooltip');
require('jquery-ui');
var exts = require('./d3Extensions.js')
var dataContainer = require( "./dataContainer.js" );
var barPlot = require("./barPlot.js");
var heatmap = require("./heatmap.js");
require('string.prototype.startswith');
//require("jquery-ui-browserify");
//qvar stats = require('stats-lite');
/*
 * expression-bar
 * https://github.com/homonecloco/expression-bar
 *
 * Copyright (c) 2014 Ricardo H. Ramirez-Gonzalez
 * Licensed under the MIT license.
 */

/**
@class expressionbar
*/

/**
 * Private Methods
 */

/*
 * Public Methods
 */


 var ExpressionBar = function (options) {
   var self = this;
   this.setDefaultOptions();
   jQuery.extend(this.opt, options);
   this.opt.sc = d3.scale.category20();
   this.opt.defaultGroupBy = this.opt.groupBy;
   this.setupContainer();
   this.setupButtons();
   this.setupProgressBar();


   this.setupSVG();


   

  switch(this.opt.plot ){
    case 'Bar':
    this.opt.calculateLog = false;
    this.renderObject = new barPlot.BarPlot(this);
    break;
    case 'HeatMap':
    this.opt.showHomoeologues = true;
    this.opt.calculateLog= true;
    this.renderObject = new heatmap.HeatMap(this);
    break;
    default:
    console.error('plot options must be "Bar" or "HeatMap. Used ' + this.opt.plot);
    return;

  }
  this.loadExpression(this.opt.data);
};

ExpressionBar.prototype._restoreProperty = function(key){
  var stored = this._retrieveValue(key);
  if(stored){
    this.opt[key] = stored;
  }
}; 

ExpressionBar.prototype.restoreDefaults = function(){
  this._removeValue('groupBy');
  this._removeValue('renderProperty');
  this._removeValue('sortOrder');
  this._removeValue('renderedOrder');
  this._removeValue('selectedFactors');
  this._removeValue('showHomoeologues');
  this._removeValue('calculateLog');
  switch(this.opt.plot ){
     case 'Bar':
      this.opt.calculateLog = false;
    break;
    case 'HeatMap':
      this.opt.showHomoeologues = true;
     this.opt.calculateLog= true;
    break
  };

  this.opt.groupBy = this.opt.defaultGroupBy;
  this.opt.selectedFactors = this.data.selectedFactors;
  this.data.sortOrder = [];
  this.dataLoaded(); 
  this.refresh();
};

ExpressionBar.prototype.restoreDisplayOptions = function(){
  this._restoreProperty('groupBy');
  this._restoreProperty('renderProperty');
  this._restoreProperty('sortOrder');
  this._restoreProperty('renderedOrder');
  this._restoreProperty('selectedFactors');
  this._restoreProperty('showHomoeologues');
  this._restoreProperty('colorFactor');
  this._restoreProperty('calculateLog');
  // should we add an option to the orders?
  // this can tide up this bit
  if(typeof this.opt.sortOrder !== 'undefined'){
    this.data.sortOrder = this.opt.sortOrder;
  }else{
    this.data.sortOrder = [];
  }

  var hom_checked = false;  
  if(this.opt.showHomoeologues){
    hom_checked = true;
  }
  jQuery( '#' + this.opt.target + '_showHomoeologues' )
  .prop('checked', hom_checked);


  var log_checked = false;  
  if(this.opt.calculateLog){
    log_checked = true;
  }
  jQuery( '#' + this.opt.target + '_log2' )
  .prop('checked', log_checked);

};

ExpressionBar.prototype.setupProgressBar = function(){
  var progressBarId  =  this.opt.target + '_progressbar';
  this.pb = jQuery( '#' + progressBarId );
  this.pb.attr('min-height', '20px');
  this.pb.progressbar({
    value: false
  });
  this.pb.hide(); 
};

ExpressionBar.prototype.setupSVG = function(){
 var self = this;
 this.renderGroupSelectorColour(); 
 this.chart = d3.select('#'+this.chartSVGid).
 attr('width', this.opt.width).
 style('font-family', self.opt.fontFamily).
 style( 'font-size', self.opt.barHeight + 'px');
 
 this.chartHead = d3.select('#'+this.chartSVGidHead).
 attr('width', this.opt.width).
 style('font-family', self.opt.fontFamily).
 style( 'font-size', self.opt.barHeight + 'px');

 //css({'font-family': self.opt.fontFamily, 
 // 'font-size': self.opt.barHeight + 'px'});

this.chartHead.attr('height', this.opt.headerOffset);
this.chartFoot = d3.select('#'+this.chartSVGidFoot).
attr('width', this.opt.width);
this.chartFoot.attr('height', 40).
style('font-family', self.opt.fontFamily).
style( 'font-size', self.opt.barHeight + 'px');


this.barGroups = [];

this.chart.on('mousemove', function(e){
  self.highlightRow(this);
});
this.chart.on('mousemove', function(e){
  self.highlightRow(this);
});
this.chart.on('mouseenter', function(e){
  self.showHighithRow();
});
this.chart.on('mouseleave', function(e){
  self.hideHidelightRow();
});


};



ExpressionBar.prototype.setupButtons = function(){
 var self = this;
 this.propertySelector = jQuery('#'+ this.opt.target+'_property');
 this.groupSelectorColour = jQuery('#'+ this.opt.target+'_group');
 this.saveSVGButton = jQuery('#'+ this.opt.target+'_save');
 this.saveSVGButton.click(function(e) {
  self.saveRenderedSVG();
});

 this.savePNGButton = jQuery('#'+ this.opt.target+'_save_png');
 this.savePNGButton.click(function(e) {
  self.saveRenderedPNG();
});
};

ExpressionBar.prototype.setupContainer = function(){
 var self = this;
 this._container = jQuery('#'+self.opt.target);
 this._container.css({
  'text-align': 'center',
  'vertical-align':'top',
  'display': 'table-cell',
  'width': self.opt.width + 'px',
  'height': self.opt.height + 'px',
  'overflow': 'scroll',
  'backgroundColor': self.opt.backgroundColor
});
 this.chartSVGid =this.opt.target+'_chart_svg';
 this.chartSVGidHead =this.opt.target+'_header_svg';
 this.chartSVGidFoot =this.opt.target+'_footer_svg';
 this.sortDivId = this.opt.target + '_sort_div';

 this._container.append('Expression unit: <select id="'+ 
  this.opt.target+'_property"></Select>');

  this._container.append(' <input type="checkbox" id="'+ 
  this.opt.target+'_log2">log2</input>');
  this._container.append('<button type="button" id="' +
  this.opt.target + '_save">Save as SVG</button>');
  this._container.append('<button type="button" id="' +
  this.opt.target + '_save_png">Save as PNG</button>');
  this._container.append('<button type="button" id="' +
  this.opt.target + '_save_data">Save data</button>');
  this._container.append('<button type="button" id="' +
  this.opt.target + '_restore_defaults">Restore Defaults</button>');

  this._container.append('<span id="'+this.opt.target +'_homSpan">\
  <input id="' +  this.opt.target + '_showHomoeologues" type="checkbox"\
  name="showHomoeologues" value="show">Homoeologues </input> </span>');
  this._container.append('<div id="' +
  this.opt.target + '_progressbar" width="20px" height="20px"> </div>');
  this._container.append('<div id="' +
  this.opt.target + '_preferences"></div>');
  this._container.append('<br/><svg id="' + 
  this.chartSVGidHead + '" ></svg>');
  this._container.append('<div id="' + this.sortDivId +
  '" height="20px"></div><br/>');

 var central_str='<div style="overflow-y: auto;max-height:' + this.opt.height +'px; ">'
 central_str += '<svg id="' + this.chartSVGid + '" ></svg></div>'

 this._container.append(central_str);

 this._container.append('<br/><svg id="' + 
  this.chartSVGidFoot + '" ></svg>');

jQuery( '#' + this.opt.target + '_save_data' ).on('click', function(evt) {
  self.saveRenderedData(self);
});

jQuery( '#' + this.opt.target + '_restore_defaults' ).on('click', function(evt) {
  self.restoreDefaults();
});

 jQuery( '#' + this.opt.target + '_log2' ).
 on('change', function(evt) {
  self.opt.calculateLog = this.checked;
  self.refresh();
  self._storeValue('calculateLog',this.checked);
});


 jQuery( '#' + this.opt.target + '_showHomoeologues' ).
 on('change', function(evt) {
  self.opt.showHomoeologues = this.checked;
  self.refreshSVG(self);
  self.refresh();
  self._storeValue('showHomoeologues',this.checked);
});

};

ExpressionBar.prototype.setDefaultOptions = function(){
  this.opt = {
   target: 'bar_expression_viewer',
   fontFamily: 'Andale mono, courier, monospace',
   fontColor: 'white',
   backgroundColor: 'white',
   selectionFontColor: 'black',
   selectionBackgroundColor: 'yellow',
   width: '1100',
   height: '500', 
   barHeight: 10,
   labelWidth: 500,
   renderProperty: 'tpm',
   renderGroup: 'group',
   restoreDisplayOptions: true,
   highlight: null, 
   groupBy: 'groups', 
   groupBarWidth: 20, 
   colorFactor: 'renderGroup', 
   headerOffset: 100,
   showHomoeologues: false,
   plot:'Bar'
 };
}

ExpressionBar.prototype.setSelectedInJoinForm = function() {

  var self = this;
  var groupByValue = this.opt.groupBy;
  if (groupByValue.constructor === Array) {
    for(var i in groupByValue){
      var toSearch = groupByValue[i].replace(/ /g, '_')
      jQuery(this.joinForm)
      .find('[name=factor][value=' + toSearch +']')
      .prop('checked',true);

    }
    groupByValue = 'factors';
  }
  jQuery(this.joinForm)
  .find('[name=showHomoeologues][value=show]')
  .prop('checked', this.opt.showHomoeologues).
  on('change', function(evt) {
    self.opt.showHomoeologues = this.checked;
  });

  jQuery(this.joinForm)
  .find('[name=group][value=' + groupByValue +']')
  .prop('checked',true); 

  jQuery(this.joinForm)
  .find('[name=group]')
  .on('change', function(){self.toggleFactorCheckbox(self)}); 
};



//Returns if we need to update the page or not. 
ExpressionBar.prototype.updateGroupBy = function(self) { 
  var oldGroupBy = self.opt.groupBy;
  var ret = true;
  if(self.showFactors  == true){
    var facts = [];
    for(var fo in self.data.defaultFactorOrder){
      i = self.data.defaultFactorOrder[fo];
      var name=self.opt.target + '_sorted_list_'+ i.split(' ').join('_');
      var shbtn = jQuery('#showHide_' + name);
      if(shbtn.data('selected')){
        facts.push(shbtn.data('factor'));
      }
    }

    self.opt.groupBy = facts;

    if(facts.length == 0){
      self.opt.groupBy = 'ungrouped';
      ret = false;
    }
  }else{  
    //self.opt.groupBy = selectedCheckbox.val();
    ret = false;
  }  
  if(oldGroupBy == self.opt.groupBy){
    ret = false;
  }
  if(ret){
    //sessionStorage.setItem( this.opt.target + 'groupBy' , self.opt.groupBy);  
    this._storeValue('groupBy', self.opt.groupBy);
  }
  
  
  return ret;
};

ExpressionBar.prototype.setDefaultExpressionValue = function(){
  var def = this.data.getDefaultProperty();
  this._storeValue('renderProperty', def);
  this.restoreDisplayOptions();

};

ExpressionBar.prototype.refreshSVG = function() {
  var chart=this.chart;
  chart.selectAll('*').remove();
  this.data.renderedData = false;
  this.prepareColorsForFactors();
  if(! this.data.hasExpressionValue(this.opt.renderProperty)){
    this.setDefaultExpressionValue();
  }
  this.render();
  this.hideHidelightRow();
  this.refresh();
};





ExpressionBar.prototype._updateFilteredFactors = function(sortDivId){

  //This may not work when we have more than
  //checks = jQuery(":checkbox[id*='|']");
  var toSearch='#'+ sortDivId +' input:checkbox';
  this.refreshSVGEnabled = false;

  jQuery(toSearch).each(function() {
    src = jQuery(this);
    self = src.data('expression-bar');
    factor = src.data('factor');
    value = src.data('value');
    self.data.selectedFactors[factor][value] = this.checked; 
  });
  this._storeValue('selectedFactors', this.data.selectedFactors);
  this.refreshSVGEnabled = true;

};

ExpressionBar.prototype.toggleFactorCheckbox = function(shbtn){
 //var shbtn = jQuery('#showHide_' + name);
 var selected = shbtn.data('selected');
 // shbtn
 if(selected){
  shbtn.data('selected', false); 
  shbtn.removeClass('ui-icon-circle-minus');
  shbtn.addClass('ui-icon-circle-plus');
}else{
  shbtn.data('selected', true);
  shbtn.removeClass('ui-icon-circle-plus');
  shbtn.addClass('ui-icon-circle-minus');
}
};


ExpressionBar.prototype._storeValue = function(key, value){
  var val = JSON.stringify(value);
  sessionStorage.setItem(this.opt.target + "_" + key, val);
};

ExpressionBar.prototype._removeValue = function(key, value){
  sessionStorage.removeItem(this.opt.target + "_" + key);
  this.opt[key] = null;
};

ExpressionBar.prototype._retrieveValue = function(key){
  var val = sessionStorage.getItem(this.opt.target + "_" + key);
  var parsed = null;
  try {
    parsed = JSON.parse(val); 
  }catch(err){
    parsed = null;
  }
  return parsed;
};


ExpressionBar.prototype.checkSelectedFactors = function(){
  var self = this;
  for(var fo in this.data.defaultFactorOrder){
    i = this.data.defaultFactorOrder[fo];
    var name=this.opt.target + '_sorted_list_'+ i.split(' ').join('_');
    var shbtn = jQuery('#showHide_' + name);
    var groupByValue = this.opt.groupBy;

    shbtn.data('selected', false);
    shbtn.data('factor', i);  
    shbtn.on('click', function(evt){
     target = jQuery(this);

     self.toggleFactorCheckbox(target);
     self.updateGroupBy(self); 
     self.refreshSVG();
     self.data.sortRenderedGroups();
     self.refresh();
   });

    if (groupByValue.constructor === Array) {
      index = self.opt.groupBy.indexOf(i) 
      self.showFactors = true;
      if(index < 0 ){
        if(shbtn.hasClass('ui-icon-circle-minus')){
          shbtn.removeClass('ui-icon-circle-minus');
          shbtn.addClass('ui-icon-circle-plus');
        }          
      }else{
        if(shbtn.hasClass('ui-icon-circle-plus')){
          shbtn.removeClass('ui-icon-circle-plus');
          shbtn.addClass('ui-icon-circle-minus');
        }
        shbtn.data('selected', true);
      }
    }else{
      if(shbtn.hasClass('ui-icon-circle-plus')){
        shbtn.removeClass('ui-icon-circle-plus');
        shbtn.addClass('ui-icon-circle-minus');
      }
    }
  }
};


ExpressionBar.prototype.renderSortWindow = function(){
  var self = this;
  var selectedFactors = this.data.selectedFactors;

  if(typeof this.opt.selectedFactors !== 'undefined' ){
    selectedFactors = this.opt.selectedFactors;
  }

  var listText = ''

  var factorCount = 0;
  for(fo in this.data.defaultFactorOrder){
    var i = this.data.defaultFactorOrder[fo];
    factorCount ++;
    var orderedKeys = this.data.getSortedKeys(fo);
    name=this.opt.target + '_sorted_list_'+ i.split(' ').join('_');

    listText += '<span id="span_' + 
    name + '" class="ui-icon  ui-icon-arrowthick-2-n-s" title="Filter/reorder" ></span>'
    listText += '<span id="showHide_' + name + '" class="ui-icon  ui-icon-circle-plus"\
    title="Display/Hide Category"  ></span>'

    listText += '<div id="dialog_' + name + '"  \
    style="z-index:3; overflow:auto; min-width:250px; max-height:' + this.opt.height/2 +'px" >' ;

    listText += '<div id="all_' + name + '"  onmouseover="this.style.cursor=\'pointer\';">all</div>';
    listText += '<div id="none_' + name +'"  onmouseover="this.style.cursor=\'pointer\';">none</div>';
    listText += '<div id="div_' + name + '">' ;  
    listText += '<form id="' + name +'">';

    //console.log(name);
    for(j in orderedKeys){
      var bgcolor = this.factorColors[i][orderedKeys[j]];
      var longFactorName = this.data.longFactorName[i][orderedKeys[j]];
      var shortId = i.split(' ').join('_') + '|' + orderedKeys[j];
      var checked = '';
      if(selectedFactors[i][orderedKeys[j]]){
        checked = 'checked';
      }

      listText += '<div \
      id="' + this.opt.target + '_sorted_position:' + shortId +'" \
      style="background-color:' + bgcolor + '" \
      height="'+this.opt.barHeight+ 'px" \
      data-factor="'+ i +'" \
      data-value="' + orderedKeys[j] +'" \
      title="' + longFactorName +'"\
      >' ;
      var toDisplay = longFactorName.length > 40 ?  orderedKeys[j] : longFactorName; 
      listText += '<input type="checkbox" id="' +shortId+'" \
      name="' +  shortId + '" \
      data-factor="'+ i +'" \
      data-value="' + orderedKeys[j] +'" \
      ' + checked + '/>';
      listText +=   toDisplay + '</div>'  ;

    }
    listText += '</form>' ;
    listText += "</div>" ;
    listText += "</div>" ;
  }

  this.sortDiv = jQuery('#'+this.sortDivId);
  this.sortDiv.css("min-height","10px")
  this.sortDiv.tooltip({
    track: true
  });

  this.sortDiv.html(listText); 
  //this.sortDiv.css('column-count',factorCount);
  //this.sortDiv.css('height',factorCount * this.opt.barHeight *2);

  this.sortDiv.disableSelection();
  checks = jQuery(":checkbox[id*='|']");
  
  checks.click(function(evt){
    var src = jQuery(this);
    var self2 = src.data('expression-bar');
    self2._updateFilteredFactors(self2.sortDivId);
    if(self2.refreshSVGEnabled == true){
      self2.updateGroupBy(self2);  
      self2.refreshSVG(self2); 
    }
  });

  checks.data("expression-bar", this);
  var xFact = 0;
  for(var fo in this.data.defaultFactorOrder){
    i = this.data.defaultFactorOrder[fo]
    var name=this.opt.target + '_sorted_list_'+ i.split(' ').join('_');
    jQuery('#span_' + name).on("click", function(e){
      var nameinside = e.target.id.replace("span_", "dialog_")
      var sdialog = jQuery('#'+nameinside);
      sdialog.show();
      jQuery(document).mouseup(function (e){
        var container = sdialog;
      if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
        container.hide();
      }
    });

    });

    var s = jQuery('#'+ name);
    var sbtn = jQuery('#span_' + name);
    var shbtn = jQuery('#showHide_' + name);
    var sdialog = jQuery('#dialog_' + name);
    var count = s.children().length;
    var sall = jQuery('#all_'+ name);
    var snone = jQuery('#none_'+ name);

    sall.on('click', function(e){
      var nameinside = e.target.id.replace('all_', '');
      self.selectAllorNoneFactor(nameinside, true);

    });

    snone.on('click', function(e){
      var nameinside = e.target.id.replace('none_', '');
      self.selectAllorNoneFactor(nameinside, false);

    });

    s.css('text-align', 'left');
    s.css('max-width','100%;')
    s.css('overflow-x','hidden;')
    s.sortable({
      axis: "y",
      update: function(event, ui) {
        var factor = ui.item.data('factor');
        var value  = ui.item.data('value');
        var index  = ui.item.index();    
        self._refershSortedOrder(factor);
      }
    });

    sbtn.attr('width', this.opt.barHeight    * 2 );
    sbtn.attr('height', this.opt.barHeight );
    sbtn.css('position', 'absolute');
    sbtn.css('left', xFact + this.opt.groupBarWidth);
    sbtn.css('top', 'inherit');

    var possbtn = sbtn.position();

    shbtn.attr('width', this.opt.barHeight    * 2 );
    shbtn.attr('height', this.opt.barHeight );
    shbtn.css('position', 'absolute');
    shbtn.css('left', xFact + this.opt.groupBarWidth);


    shbtn.css('top', possbtn.top + 15);


    sdialog.css('position', 'absolute');
    sdialog.css('left', xFact );
    sdialog.css('background-color', 'white');
    sdialog.css('border', 'outset');
    sdialog.css('top', possbtn.top + 15);
    s.disableSelection();
    sdialog.hide();

    //sdialog.on("mouseleave", function(){sdialog.hide()})
    
    xFact += self.opt.groupBarWidth;
  }

};

ExpressionBar.prototype.selectAllorNoneFactor = function(nameInside, value){
  var self = this;
      jQuery('#'+ nameInside +' input:checkbox').each(function() {
        jQuery(this).prop( 'checked', value ); // do your staff with each checkbox
        self._updateFilteredFactors(self.sortDivId );
        
      });
      if(self.refreshSVGEnabled == true){
        self.updateGroupBy(self);  
        self.refreshSVG(self); 
      }
    }

ExpressionBar.prototype._refershSortedOrder = function(factor){
  var self = this;

  var find = factor.replace(/ /g, '_');
  var name=this.opt.target + '_sorted_list_'+ find;
  jQuery('#'+ name  + ' div').each(function(e) {
    div = jQuery(this);
    var factor = div.data('factor');
    var value  = div.data('value');   
    self.data.renderedOrder[factor][value] = div.index();
  } 
  );
  this.data.addSortPriority(factor, false);
  this._storeValue('sortOrder', this.data.sortOrder);
  this._storeValue('renderedOrder', this.renderedOrder);

  this.data.sortRenderedGroups(this.data.sortOrder, this.renderedOrder);
  this.setFactorColor(factor);
  this.refresh();
};

ExpressionBar.prototype.showHighlightedFactors = function(toShow, evt){
  //console.log("TADA!");

  //console.log(evt);
  var factorNames = this.data.longFactorName;
  var self = this;
  for(key in toShow.factors){

    var value = toShow.factors[key];
    
    var escaped_key = key.replace(/ /g, '_');
    var label_div_id = self.opt.target + '_factor_label_' + escaped_key;
    var colour_div_id = self.opt.target + '_factor_colour_' + escaped_key;
    var label_full_div_id = self.opt.target + '_factor_full_label_' + escaped_key;

    var long_name = factorNames[key][value];
    var colour = self.factorColors[key][value];
    if(long_name.length > 28){
      long_name = value;
    }
    jQuery('#' + label_div_id).text(long_name);
    jQuery('#' + colour_div_id).css('background-color', colour);
    jQuery('#' + label_full_div_id).show();
  }

};

ExpressionBar.prototype.hideHighlightedFactors = function(){
  var self = this;
  this.data.factors.forEach(function(value, key, map){
    var escaped_key = key.replace(/ /g, '_');
    var label_full_div_id = self.opt.target + '_factor_full_label_' + escaped_key;
    jQuery('#'+label_full_div_id).hide();
  });
};

ExpressionBar.prototype.renderPropertySelector = function(){
  var self = this;
  var groupOptions = this.data.getExpressionValueTypes();

  self.propertySelector
  .find('option')
  .remove();

  for(i in groupOptions){
    var key = groupOptions[i];
    self.propertySelector
    .append(jQuery('<option></option>')
      .attr('value',key)
      .text(key));
  }
  

  this.propertySelector.val(this.opt.renderProperty);
  this.propertySelector.on('change', function(event) { 
   self.opt.renderProperty  = self.propertySelector.find(':selected').text();;
   self._storeValue('renderProperty', self.opt.renderProperty);
   self.refresh();
 } );

};

ExpressionBar.prototype.renderGroupSelectorColour = function(){
 var self = this;
 var groupOptions = {'study':'study', 'group':'group'};
 jQuery.each(groupOptions, function(key,value) {   
   self.groupSelectorColour
   .append(jQuery('<option></option>')
    .attr('value',key)
    .text(value)); 
 });
 this.groupSelectorColour.val(this.opt.renderGroup);

 this.groupSelectorColour.on('change', function(event) { 
   self.opt.renderGroup  = self.groupSelectorColour.find(':selected').text();;
   self.refresh();
 } );

};

ExpressionBar.prototype.saveRenderedPNG = function(){
  var svgData = this.prepareSVGForSaving();
  var canvas = document.createElement( 'canvas' );
  var scaleBy = 4;
  canvas.height = scaleBy * ( this.opt.headerOffset + 20 + this.totalHeight );
  canvas.width = scaleBy *  this.opt.width;
  var ctx = canvas.getContext( '2d' );
  var img = new Image();
  
  //img.width = this.opt.width * scaleBy; 
  //img.height = (this.opt.headerOffset + 20 + this.totalHeight) * scaleBy ;
  img.src = "data:image/svg+xml;base64," + btoa( svgData );
  img.style='width:100%'
  img.onload = function() {
    ctx.drawImage(img, 0, 0, canvas.width , canvas.height);
    var canvasdata = canvas.toDataURL('image/png');
    var a = document.createElement('a');
    a.download = 'expVIP_'+Date.now()+'.png';
    a.href = canvasdata; 
    document.body.appendChild(a);
    a.click();
  };
};

ExpressionBar.prototype.prepareSVGForSaving = function(){
   //get svg element.

   var svgHead = document.getElementById(this.chartSVGidHead);
   var svg = document.getElementById(this.chartSVGid);
   var svgFoot = document.getElementById(this.chartSVGidFoot);
  //get svg source.
  
  var headHeight = svgHead.height.baseVal.value;
  var footHeight = headHeight + svg.height.baseVal.value;

  var serializer = new XMLSerializer();
  var sourceHead = serializer.serializeToString(svgHead);
  var sourceMain = serializer.serializeToString(svg);
  var sourceFoot = serializer.serializeToString(svgFoot);
  var svg_width  = this.opt.width;
  var svg_height = this.opt.headerOffset + 60 + this.totalHeight ;


  sourceMain = sourceMain.replace(/^<svg/, '<svg y="' + headHeight + '" ');
  sourceFoot = sourceFoot.replace(/^<svg/, '<svg y="' + footHeight + '" ');
  var source = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" \
  font-family="' + this.opt.fontFamily + '" font-size="' + this.opt.barHeight + 'px" \
  width="'+ svg_width  +'px" height="' + svg_height   + 'px" \
  viewbox="0 0 ' + svg_width + ' '   + svg_height + '">'

  source += sourceHead;
  source += sourceMain;
  source += sourceFoot;
  source += '</svg>'
  //add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  return source;
};

ExpressionBar.prototype.saveRenderedData = function(self){
  //console.log("saveRenderedData");

  var toSave = self.data.renderedData;
  var selectedFactors = self.data.selectedFactors;
  var output = '';
  var factorNames = this.data.longFactorName;
  for(fact in selectedFactors){
   // console.log(fact);
   output += fact + "\t"
   vals = selectedFactors[fact];
   var curr_fact = factorNames[fact];
   for(v in vals){
    if(vals[v]){

      curr_long = curr_fact[v];
      output +=  curr_long + ", ";
    }
  }
  output += "\n";
}
var renderedProperty = self.opt.renderProperty ;
output += "\t";
for(gene in toSave ){
  output += renderedProperty + "\t" + "SEM" + "\t";
}
var filename = renderedProperty +  "_";
output += "\n\t";
for(gene in toSave ){
  output += toSave[gene][0].gene + "\t" + toSave[gene][0].gene + "\t";
  filename += toSave[gene][0].gene + "_";
}
filename += ".tsv"
output += "\n";

var total = toSave[0].length

for(var i = 0; i < total; i++){
  var name = toSave[0][i].name
  if(toSave[0][i].longDescription){
    name = toSave[0][i].longDescription
  }
  output +=  name + "(n=" + toSave[0][i].data.length  + ")\t";

  for(gene in toSave ){
    output += toSave[gene][i].value + "\t" + toSave[gene][i].stdev + "\t";
  }
  output += "\n";
}

self.saveTextFile(filename, output);
};

ExpressionBar.prototype.saveRenderedSVG = function(){
  var source = this.prepareSVGForSaving();
  //convert svg source to URI data scheme.
  var url = 'data:image/svg+xml;charset=utf-8,'+ encodeURIComponent(source);

  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', 'expVIP_'+Date.now()+'plot.svg');
  if (document.createEvent) {
   var event = document.createEvent('MouseEvents');
   event.initEvent('click', true, true);
   pom.dispatchEvent(event);
 }
 else {
  console.log("Create event not working");
}
if(pom.parentElement){
  pom.parentElement.removeChild(pom);
}

};


/**
 * Sets a Map with the available factors and the values from the json
 * response. 
 */
 ExpressionBar.prototype.setAvailableFactors = function(){
   this.data.setAvailableFactors();
 };

 ExpressionBar.prototype.loadExpression = function(url) {
  if (typeof url === 'undefined') { 
    return ;
  }
  var self = this;
  self.pb.show();
  d3.json(url, function(error, json) {
    if (error) {
      console.warn(error);
      return;
    }
    
    self.data = new dataContainer.ExpressionData(json, self.opt);
    if(typeof self.data.compare === 'undefined'){
      self.data.compare = '';
    }
    self.pb.hide();
    self.dataLoaded();
  });
};


ExpressionBar.prototype.isFactorPresent = function(factor) {
  var renderedData = this.data.renderedData;
  var globalFactors = this.factors;
  if(this.opt.groupBy == 'ungrouped' || this.opt.groupBy === 'groups' ){
    //We need to add a better decision here. M
    return true;
  }else{
    return jQuery.inArray(factor, this.opt.groupBy) > -1;
  }
};

ExpressionBar.prototype.getDefaultColour = function(){
  return this.opt.groupBy[0];
};

ExpressionBar.prototype.refreshBar = function(gene, i){
  this.renderObject.refreshBar(gene,i)
}; 

ExpressionBar.prototype.refreshScale = function(){
  this.renderObject.refreshScale();
};

ExpressionBar.prototype.refresh = function(){
  var chart=this.chart;
  this.data.renderedData = this.data.getGroupedData(this.opt.renderProperty,this.opt.groupBy);
  this.totalRenderedGenes = this.data.renderedData.length;
  this.x = this.renderObject.rangeX();

  var gene = this.opt.highlight;
  for (var i in  this.data.renderedData) {
    this.refreshBar(gene, i);
  };
  this.refreshTitles();
  this.refreshScale();
};


ExpressionBar.prototype.maxInData = function(){
  return this.data.max;
};

ExpressionBar.prototype.prepareColorsForFactors = function(){
  //this.factorColors = Map.new();
  this.factorColors = this.data.prepareColorsForFactors();
};

ExpressionBar.prototype.refreshTitles = function(){
  var barHeight = this.opt.barHeight;
  var arr = this.data.renderedData[0];
  var headerOffset = 0;
  var factorLength = this.data.factors.size;
  this.titleGroup.selectAll('rect').transition().duration(1000).ease("cubic-in-out")
  .attr('y', function(d,i){
    
    var groupIndex = Math.floor(i/factorLength);
    var pos = arr[groupIndex].renderIndex ;
    return (((pos ) * barHeight) ) + headerOffset;
  });

  this.titleGroup.selectAll('text').transition().duration(1000).ease("cubic-in-out")
  .attr('y', function(d,i){
   
   var pos = arr[i].renderIndex ; 
   return (((pos + 1 ) * barHeight)) + headerOffset - 3;
 });

};

ExpressionBar.prototype.calculateBarWidth = function(){
  return this.renderObject.calculateBarWidth();
};

ExpressionBar.prototype.renderGeneTitles = function(i){
   //this.factorTitle = this.chartHead.append('g');
   var data = this.data.renderedData;
   var dat = data[i];
   if (typeof dat === 'undefined') { 
    return ;
  }
  if (typeof dat[0] === 'undefined') { 
    return ;
  }
  var render_width = this.calculateBarWidth();
  var barHeight = this.opt.barHeight;
  var labelWidth = this.opt.labelWidth;
  var x=this.x;
  var sc = this.opt.sc;
  var blockWidth = (this.opt.width - this.opt.labelWidth) / this.totalRenderedGenes;
  var gXOffset = (blockWidth * i) + labelWidth;
  bar = this.factorTitle.append('g');
  bar.attr('transform', 'translate(' + gXOffset  + ',' + barHeight + ')');
  var gene = dat[0].gene;
  var weight = 100;
  var decoration = ''
  if(gene == this.data.gene){
    weight = 900;
    decoration = 'underline';
  } 

  
  var geneText = bar.append('text')
  .attr('x',0)
  .attr('y', 10)
  //.attr('dx', '.35em')
  .attr('width', blockWidth)
  .attr('height', barHeight)
  //.attr('font-weight',weight)
  .attr('text-align', 'left')
  .attr('text-decoration', decoration)
  .text(gene); 
  var renderedTextWidth = geneText.node().getBBox().width;
  var renderedTextHeight = geneText.node().getBBox().height;
  var newHeigth = barHeight;
  
  if(renderedTextWidth > blockWidth){
    geneText.attr('transform', 'rotate(270)')  
    .attr('dy', '0.5em')  
  }

  if(renderedTextWidth > this.opt.headerOffset){
    newHeigth =  0.9 * this.opt.barHeight * (this.opt.headerOffset/renderedTextWidth); 
   // geneText.attr('dy', '0.25em') 
  }

  if(renderedTextHeight   > blockWidth  ){
    console.log("Render height: " + renderedTextHeight);
    console.log("Max height:" + blockWidth)

    newHeigth =  this.opt.barHeight * ( blockWidth/ renderedTextHeight );
    geneText.attr('dy', '-0.25em');
    console.log("height change");
  }
  
  
  



   geneText.style('font-size', newHeigth  + 'px') ;


};




ExpressionBar.prototype.renderFactorTitles = function(){
  this.factorTitle = this.chartHead.append('g');
  this.factorTitle.attr('transform', 'translate(0,' + (this.opt.headerOffset - (this.opt.barHeight * 2 )) + ')');

  var barHeight = this.opt.barHeight;
  var xFact = 0;
  var self = this;
  this.data.factors.forEach(function(value, key, map){
    self.factorTitle.append('text')
    .attr('y', xFact)
    .attr('dx', '-2.0em')
    .attr('dy', '1em')
    .attr('transform', function(d) {
     return 'rotate(-90)' 
   })
     //.style('font-size','10px') 
     .text(key);
     xFact += self.opt.groupBarWidth;
   });
};

ExpressionBar.prototype.getTitleSetOffset = function(){
  return this.data.factors.size  * this.opt.groupBarWidth;
};

ExpressionBar.prototype.getTitleFactorWidth = function(){
  return this.opt.labelWidth - this.getTitleSetOffset();
};

ExpressionBar.prototype.renderTitles = function(){
  var barHeight = this.opt.barHeight
  var self = this;
  var headerOffset = 0;
  this.titleGroup = this.chart.append('g');
  this.titleGroup.attr('transform', 'translate(0,' + barHeight + ')');
  arr = this.data.renderedData[0];
  var titleSetOffset = this.getTitleSetOffset();
  var factorWidth = this.opt.groupBarWidth - 2; 
  
  for(i in arr){

    var pos = arr[i].renderIndex ; 
    this.titleGroup.append('text')
    .attr('x',titleSetOffset)
    .attr('y', (((pos + 1 ) * barHeight)  ) + headerOffset)
    .attr('dx', '.35em')
    .attr('height', barHeight - 2)
    .on('click', function(){
      self.setFactorColor('renderGroup')
    })
    .text(arr[i].name + ' (n=' + arr[i].data.length +  ')');
    var xFact = 0;
    this.data.factors.forEach(function(value, key, map){
      var factorValue = arr[i].factors[key];

      var factorLongName = self.data.longFactorName[key][factorValue];
      var color = self.factorColors[key][factorValue];
      var tooltip = key + ': ' + factorLongName;
      var rect = self.titleGroup.append('rect')
      .attr('x', xFact)
      .attr('y', (pos * barHeight) + headerOffset )
      .attr('height', barHeight - 2)
      .attr('fill', color)
      .attr('width', factorWidth)
      .attr('opacity', 0.0);

      if(typeof factorValue !== 'undefined'){
        rect.on('mouseenter', function(){self.showTooltip(tooltip, this)})
        .on('click', function(){
          self.data.addSortPriority(key, false);
          self._storeValue('sortOrder', self.data.sortOrder);
          self.data.sortRenderedGroups();
          self.setFactorColor(key);
          self.refresh();
        })
        .on('mouseleave', function(){self.hideTooltip()});
        rect.attr('opacity', 1.0);
      }
      
      xFact += self.opt.groupBarWidth;
    });
}
};

ExpressionBar.prototype.setFactorColor = function(factor){
  this.opt.colorFactor = factor;
  this._storeValue('colorFactor', factor);
};

ExpressionBar.prototype.renderTooltip = function(){
  var barHeight = this.opt.barHeight;
  this.tooltipBox = this.chart.append('rect');
  this.tooltip = this.chart.append('text');
  this.tooltip.attr('x',0)
  .attr('y', 0)
  .attr('height', barHeight -2)
  .attr('fill', 'white')
  .attr('font-size', 10)
  .attr('visibility', 'hidden')
};

ExpressionBar.prototype.renderSelection = function(){
  var barHeight = this.opt.barHeight;
  this.selectionBox = this.chart.append('rect')
  .attr('y', 10)
  .attr('height', barHeight )
  .attr('width', this.opt.width)
  .attr('fill', 'lightgray')
  .attr('font-size', 10);
 
  var selectionWidth = this.calculateBarWidth();
  this.selectionBoxGene = this.chart.append('rect')
  .attr('y', 0)
  .attr('height', this.totalHeight  )
  .attr('width', selectionWidth)
  .attr('fill', 'lightgray');
  

  this.selectionBoxTitles = this.chartHead.append('g');
  this.selectionBoxTitles.append('rect')
  .attr('y', 0)
  .attr('height', this.opt.headerOffset)
  .attr('width', selectionWidth)
  .attr('fill', 'lightgray');

//  .attr('visibility', 'hidden')
};

ExpressionBar.prototype.highlightRow = function(target){
  if(typeof this.data === 'undefined'){
    return;
  }
  if(typeof this.data.renderedData === 'undefined'){
    return;
  }
  if(typeof this.data.renderedData[0] === 'undefined'){
    return;
  }
  if(typeof this.selectionBox === 'undefined'){
    return;
  }
  var d3SVG = d3.select(target);
  var mouse = d3.mouse(target);
  var index = Math.floor(mouse[1]/this.opt.barHeight);
  if(index == 0){
    index = 1;
  }
  var elements = this.data.renderedData[0].length;
  if(index > elements ){
    index = elements;
  }
  var pos = index  * this.opt.barHeight;
  this.selectionBox.attr('y', pos); 

  var labelWidth = this.opt.labelWidth;
  var localPos = Math.floor(mouse[0]) - this.opt.labelWidth;
  var pos2;
  if(localPos > 0){
    var blockWidth = (this.opt.width - this.opt.labelWidth) / this.data.renderedData.length;
    var index2 = Math.floor(localPos/blockWidth);
    pos2=(index2 * blockWidth) + this.opt.labelWidth;
  }else{
    pos2 = 0 - this.opt.labelWidth;

  }
  this.selectionBoxGene.attr('x', pos2);
  this.selectionBoxTitles.attr('transform', 'translate('+pos2+',0)');
}

ExpressionBar.prototype.showHighithRow = function(){
  if(typeof this.selectionBox !== 'undefined'){
    this.selectionBox.attr('visibility', 'visible'); 
    if(this.opt.plot == 'HeatMap'){
      this.selectionBoxGene.attr('visibility', 'visible'); 
      this.selectionBoxTitles.attr('display', 'inline');
    }
  }
 
}

ExpressionBar.prototype.hideHidelightRow = function(){
  if(typeof this.selectionBox !== 'undefined'){
    this.selectionBox .attr('visibility', 'hidden');
    this.selectionBoxGene.attr('visibility', 'hidden'); 
    this.selectionBoxTitles.attr('display', 'none');
  }
}



ExpressionBar.prototype.showTooltip = function(mouseovertext, evt) {
  var tooltip = this.tooltip;
  var coordinates = [0, 0];
  coordinates = d3.mouse(evt);

  var svgPosition = d3.select(evt).position(this);
  var x = svgPosition.left + 11  ;
  var y = svgPosition.top +  27 ;

  var svg1 = document.getElementById(this.chartSVGid);
  var bBox = svg1.getBBox();

  var max =  bBox.height - this.opt.barHeight;
  if(y > max){
    y = max;
  }

  tooltip.attr('x', x);
  tooltip.attr('y', y);
  tooltip.text(mouseovertext);
  var textBox = tooltip.node().getBBox();
  
  var xOffset = 0;
  var rigthBox = textBox.x + textBox.width;

  if(  rigthBox > bBox.width){
    xOffset = textBox.width;
    tooltip.attr('x', x - xOffset);
  }

  var padding = 2;
  this.tooltipBox.attr('x', textBox.x - xOffset - padding);
  this.tooltipBox.attr('y', textBox.y - padding);
  this.tooltipBox.attr('width', textBox.width + (padding*2))
  this.tooltipBox.attr('height', textBox.height + (padding*2))
  tooltip.attr('visibility', 'visible');
  this.tooltipBox.attr('visibility', 'visible');
}

ExpressionBar.prototype.hideTooltip = function() {
  this.tooltip.attr('visibility', 'hidden');
  this.tooltipBox.attr('visibility', 'hidden');
return;
}

ExpressionBar.prototype.saveTextFile = function(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

ExpressionBar.prototype.render = function() {
  var chart=this.chart;
  var gene = this.opt.highlight;

  var data = this.data.getGroupedData(this.opt.renderProperty, this.opt.groupBy);
  var sc = this.opt.sc;
  var barHeight = this.opt.barHeight;
  var groupBy = this.opt.renderGroup;
  this.totalGenes = Object.keys(this.data.values).length; 
  this.totalRenderedGenes = data.length;

  var barWidth = this.renderObject.calculateBarWidth();
  this.data.renderedData = data;

  this.x = d3.scale.linear().range([0, barWidth]);
  this.x.domain([0,this.maxInData()])

  var x=this.x;
  if(data[0]){ 
    this.totalHeight = barHeight * (data[0].length + 2 );
  }else{
    this.totalHeight = 100;
  }

  chart.attr('height', this.totalHeight );

  this.chartFoot.selectAll("*").remove();
  this.chartHead.selectAll("*").remove();
  
  this.renderSelection();

  this.renderTitles();
  this.renderFactorTitles();

  
  this.barGroup = chart.append('g');
  this.svgFootContainer = d3.select("#"+this.chartSVGidFoot);
  this.renderObject.renderGlobalScale();

  for (var i in data) {
    this.renderObject.renderGeneBar(i);
    this.renderGeneTitles(i);
    this.renderObject.renderScales(i);
  }

  this.renderTooltip(); 
};


ExpressionBar.prototype.dataLoaded = function(){
  if(this.opt.restoreDisplayOptions){
    this.restoreDisplayOptions();
  }
  this.setAvailableFactors();
  this.prepareColorsForFactors();
  this.refreshSVG();
  this.renderPropertySelector();
  
  this.renderSortWindow();
  this.checkSelectedFactors();

  if(typeof this.data.compare === "undefined" || this.data.compare.length == 0){
    jQuery( '#' + this.opt.target + '_homSpan' ).show();
  }else{
    jQuery( '#' + this.opt.target + '_homSpan' ).hide();
  }

  if(this.opt.plot == 'HeatMap'){
    jQuery( '#' + this.opt.target + '_homSpan' ).hide();
  }

  if(typeof this.opt.sortOrder !== 'undefined'){
    this.data.sortRenderedGroups();
    //TODO: add an option to remove the annimation on the initial load
    this.refresh(); 
  }
};

var heatmap = require( "./heatmap.js" );

require('biojs-events').mixin(ExpressionBar.prototype);
module.exports.ExpressionBar = ExpressionBar;