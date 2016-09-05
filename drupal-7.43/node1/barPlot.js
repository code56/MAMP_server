var jQuery = require('jquery');
var science = require('science');
var colorbrewer = require('colorbrewer');
var d3 = require('d3');
require('string.prototype.startswith');

require('jquery-ui');
var exts = require('./d3Extensions.js');


var BarPlot = function  (parent) {
	this.parent = parent;
	this.opt = parent.opt;

}

BarPlot.prototype.renderScales = function(i){

  var render_width = this.calculateBarWidth();  

  var axisScale = this.rangeX();
  //Create the Axis
  var xAxis = d3.svg.axis()
  .scale(axisScale).ticks(3);
  //Create an SVG group Element for the Axis elements and call the xAxis function
  var xAxisGroup = this.parent.svgFootContainer.append("g")
  .call(xAxis).attr("class", "x axis");

  var blockWidth = (this.parent.opt.width - this.parent.opt.labelWidth) / this.parent.totalRenderedGenes;                            
  var gXOffset = (blockWidth * i) + this.parent.opt.labelWidth;                              
  
  xAxisGroup.attr('transform', 'translate(' + gXOffset  + ',0)');

};

BarPlot.prototype.renderGlobalScale = function(){
	this.parent.svgFootContainer.attr("height", 40);
	return;
};

BarPlot.prototype.calculateBarWidth = function(){  
	var availableWidth = this.opt.width - this.opt.labelWidth;
    var widthPerBar = (availableWidth / this.parent.totalRenderedGenes ) - 10; // 10 px of border. maybe dynamic?
    return widthPerBar;
};

BarPlot.prototype.rangeX = function(){
	var barWidth = this.calculateBarWidth();
	var x = d3.scale.linear().range([0, barWidth]);
	x.domain([this.parent.data.min,this.parent.maxInData()]);
	return x;
}

BarPlot.prototype.renderGeneBar = function( i){
	var parent = this.parent;  
	var data = this.parent.data.renderedData;
	var dat = data[i];
	var render_width = this.calculateBarWidth();
	var barHeight = this.opt.barHeight;
	var labelWidth = this.opt.labelWidth;
	var x= this.rangeX();
	var sc = parent.opt.sc;
	var blockWidth = (parent.opt.width - parent.opt.labelWidth) / parent.totalRenderedGenes;
	var gXOffset = (blockWidth * i) + labelWidth;

	var bar = parent.barGroup.append('g');
	bar.attr('transform', 'translate(' + gXOffset  + ',' + barHeight + ')');
	var gene = '';

	for(var j in  dat){
		var d = dat[j];
		var y = (barHeight * d.renderIndex  ) ;
		var rect = bar.append('rect')
		.attr('y', y)
		.attr('height', barHeight - 2)
		.attr('fill', 'white')
		.attr('width', x(0))
		.on('mouseenter', function(da,k){
			var pos = d3.select(this).position(this);
			var index = ((pos.top ) / parent.opt.barHeight)-1;
			var tooltip =  parent.opt.renderProperty + ': ' +
			exts.numberWithCommas(da.value) + ', sem: ' + exts.numberWithCommas(da.stdev)  ;
			parent.showTooltip(tooltip, this);
			parent.showHighlightedFactors(da, this);
		}
		)
		.on('mouseleave', function(){
			parent.hideTooltip();
			parent.hideHighlightedFactors();
		});

      rect.data([d]); //Bind the data to the rect
      bar.append('line').attr('x1', 0)
      .attr('y1', y + (barHeight/2))
      .attr('x2', 0)
      .attr('y2', y + (barHeight/2) )
      .attr('stroke-width', 1 )
      .attr('stroke', 'black');
  };

};

BarPlot.prototype.refreshBar = function(gene, i){
	var data = this.parent.data.renderedData;
	var dat = data[i];
	var x=this.rangeX();
	var sc = this.opt.sc;
	var colorFactor = this.opt.colorFactor;
	var self = this;
	var colors = null;
	var barHeight = this.opt.barHeight;
	var headerOffset  = 0;

	if(! this.parent.isFactorPresent(colorFactor)){
		colorFactor = this.parent.getDefaultColour();
	}

	var getY = function(d,j){
		return (barHeight * dat[j].renderIndex) + headerOffset;   
	};

	if(colorFactor != 'renderGroup'){
		colors = this.parent.factorColors[colorFactor]; 
	}

  	//Refresh the bar sizes and move them if they where sorted
  	var bar = this.parent.barGroup.selectAll('g').filter(function (d, j) { return j == i;});
  	rects = bar.selectAll('rect').transition().duration(1000).ease("cubic-in-out")
  	.attr('width', function(d,j) {
  		var val = dat[j].value;
  		if(isNaN(val)){
  			val = 0;
  		}
  		return x(val);
  	})
  	.attr('fill', function(d,j){
  		var ret = sc(dat[j].id%20);
  		if(colorFactor != 'renderGroup'){
  			ret=colors[dat[j].factors[colorFactor]];
  		}
  		return ret;     
  	})
  	.attr('y', getY )
  	.each(function(r,j){
  		var d = dat[j];
  		var rect = d3.select(this);
  		rect.data([d]); 
  	});

  	var lines = bar.selectAll('line').transition().duration(1000).ease("cubic-in-out")
     // .attr('x1', gXOffset)
     .attr('y1', function(d,j) {return getY(d,j) + ((barHeight-2)/2.0) })
     .attr('y2', function(d,j) {return getY(d,j) + ((barHeight-2)/2.0) } )
     .attr('x2', function(d,j) {
     	var ret =x(dat[j].value + dat[j].stdev); 
     	if(isNaN(ret)){
     		ret = 0;
     	}
     	return ret} )
     .attr('x1', function(d,j) { 
     	var left = dat[j].value - dat[j].stdev;
     	if(isNaN(left)){
     		left = 0;
     	}
     	if(left < 0){
     		left = 0
     	}
     	return x(left);
     });
 }; 

 BarPlot.prototype.refreshScale = function(){
    var axisScale = this.parent.x;
    var xAxis = d3.svg.axis().scale(axisScale).ticks(3);
    var toUpdate = this.parent
    .svgFootContainer.selectAll("g.x.axis")

    toUpdate.transition()
     .duration(1000)
     .ease("cubic-in-out")
     .call(xAxis);
}



 module.exports.BarPlot = BarPlot;