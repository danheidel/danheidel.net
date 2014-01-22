window.templateData || (window.templateData = {});

(function(NS){
  var base = NS.starData = {};
  base.svgX = 1500;
  base.svgY = 1000;
  base.innerMargin = {top:15, bottom:60, left:60, right:10};
  base.outerMargin = {top:5, bottom:5, left:10, right:10};
  base.canvasMargin = {top:0, bottom: 0, left:0, right:0};
  base.starDistance = 62; //distance in parsecs

  var starTemplate = new window.templateFunctions.BuildPage({
    menuTemplate:window.templateMenu.defaultMenu,
    bodyTemplate:[{
      tag:'div',
      id:'star-div',
      style:'position:relative; height:100%;padding-left:' + base.outerMargin.left + 'px;padding-top:' + base.outerMargin.top + 'px;padding-right:' + base.outerMargin.right + 'px;padding-bottom:' + base.outerMargin.bottom+ 'px;',
      chi:[{
        tag:'svg',
        id:'star-svg',
        height:'0px',
        attr:' viewbox="0 0 ' + base.svgX + ' ' + base.svgY + '" preserveAspectRatio="none" xmlns="http://www/w3.org/2000/svg" ',
        chi:[{
          tag:'text',
          id:'star-title'},
          {tag:'g',
          class:'x axis'},
          {tag:'g',
          class:'y axis'},
          {tag:'text',
          class:'x axis-label',
          c:'B/V color ratio'},
          {tag:'text',
          class:'y axis-label',
          attr:' transform="rotate(-90)" ',
          c:'Absolute Magnitude'},
          {tag:'text',
          id:'star-count'},
          {tag:'rect',
          class:'star-class-area',
          id:'class-o'},
          {tag:'rect',
          class:'star-class-area',
          id:'class-b'},
          {tag:'rect',
          class:'star-class-area',
          id:'class-a'},
          {tag:'rect',
          class:'star-class-area',
          id:'class-f'},
          {tag:'rect',
          class:'star-class-area',
          id:'class-g'},
          {tag:'rect',
          class:'star-class-area',
          id:'class-k'},
          {tag:'rect',
          class:'star-class-area',
          id:'class-m'
        }]
  //<div id='construction-modal' class='reveal-modal'></div>
      },{
        tag:'canvas',
        id:'star-canvas',
        style:'position:absolute;top:' + base.outerMargin.top + 'px;left:' + base.outerMargin.left + 'px;'
      },{
        tag:'div',
        style:'position:absolute;top:10px;right:10px;margin-right:' + base.innerMargin.right + 'px;',
        chi:[{
          tag:'i',
          id:'star-control-button',
          class:'star-button icon-gear icon-2x',
          title:'info'},
          {tag:'i',
          id:'star-info-button',
          class:'star-button icon-info icon-2x', 
          title:'controls',
        }]
      },{
        tag:'img',
        class:'loading-gif',
        id:'star-loading',
        src:'img/ajax-loader2.gif'
      },{
        tag:'div',
        id:'star-progress',
        class:'progress-container',
        chi:[{
          tag:'div',
          id:'star-progress-bar',
          class:'progress-bar',
        }]
      },{
        tag:'div',
        id:'star-control-modal',
        class:'reveal-modal medium',
        chi:[
          {tag:'div',
          class:'panel',
          chi:[
            {tag:'p', c:'Adjust the maximum distance for the displayed stars:'},
            {tag:'a', class:'close-reveal-modal', c:'X'},
            {tag:'button', id:'star-count-bigdown', class:'button tiny', c:'- 50'},
            {tag:'button', id:'star-count-down', class:'button tiny', c:'- 5'},
            {tag:'button', id:'star-count-up', class:'button tiny', c:'+ 5'},
            {tag:'button', id:'star-count-bigup', class:'button tiny', c:'+ 50'},
            {tag:'p', id:'star-count-distance', c:' Display all stars within ' + base.starDistance + ' parsecs of you.'},
            {tag:'button', id:'star-reload', class:'button small', c:'reload'},
            {tag:'p'},
            {tag:'span', id:'star-preview-count', c:'...'}
          ]},
          {tag:'div',
          class:'panel',
          chi:[
            {tag:'p', c:'Select color scheme:'},
            {tag:'input', type:'radio', name:'colorRadio', value:'true', c:'use realistic colors ', attr:' checked '},
            {tag:'input', type:'radio', name:'colorRadio', value:'bright', c:'use bright colors'}
          ]}
        ]
      },{
        tag:'div',
        id:'star-info-modal',
        class:'reveal-modal medium',
        chi:[
          {tag:'a', class:'close-reveal-modal', c:'X'},
          {tag:'h3', c:'This is a'},
          {tag:'p'}
        ]
      }]
    }],
    funcEvents:{
      onLoad:function(){
        base.$svg = $('#star-svg');
        base.d3Svg = d3.select('#star-svg');
        base.svg = base.$svg[0];
        base.$canvas = $('#star-canvas');
        base.d3Canvas = d3.select('#star-canvas');
        base.canvas = base.$canvas[0];
        base.context = base.canvas.getContext('2d');
        
        $(window).resize(base.resize);
        
        base.$canvas.click(function(e){
          var x = e.offsetX, y = e.offsetY;
          var CI = base.xCanvasScale.invert(x);
          var AM = base.yCanvasScale.invert(y);
          console.log('canvas: ' + CI + ' ' + AM);
          CI = base.xSvgScale.invert(x / base.svgToCanvasX);
          AM = base.ySvgScale.invert(y / base.svgToCanvasY);
          console.log('SVG:    ' + CI + ' ' + AM);
        });
        
        $('#star-info-button').click(function(){
          $('#star-info-modal').foundation('reveal', 'open');
        });
        $('#star-control-button').click(function(){
          $('#star-preview-count').text('This will load ' + base.minList.length + ' stars.');
          $('#star-control-modal').foundation('reveal', 'open');
        });
        
        var previewLoad = function(){
          $('#star-count-distance').text(' Display all stars within ' + base.starDistance + ' parsecs (' + base.parsecsToLY(base.starDistance) + ' light years).');
          base.countStars(base.starDistance, function(count){
            $('#star-preview-count').text('This will load ' + count + ' stars.' + (base.starDistance > 100 ? ' (Warning, may load slowly)' : ''));
          });          
        }
        
        $('#star-count-bigdown').click(function(){
          if(base.starDistance >= 50) base.starDistance -= 50;
          previewLoad();
        });
        $('#star-count-down').click(function(){
          if(base.starDistance >= 5) base.starDistance -= 5;
          previewLoad();
        });
        $('#star-count-up').click(function(){
          base.starDistance += 5;
          previewLoad();
        });
        $('#star-count-bigup').click(function(){
          base.starDistance += 50;
          previewLoad();
        });
        $('#star-reload').click(function(){
          base.getStars(base.starDistance);
          $('#star-control-modal').foundation('reveal', 'close');
        });
        
        $('input:radio[name=colorRadio]').change(function(){
          base.resize();
          base.drawBGStars();
        });
        
        base.getStars(base.starDistance);
      },
      onUnLoad:function(){
        $(window).unbind('resize', base.resize);
        $('#star-info-button').unbind();
        $('#star-control-button').unbind();
        $('#star-preview.count').unbind();
        $('#star-count-bigdown').unbind();
        $('#star-count-down').unbind();
        $('#star-count-up').unbind();
        $('#star-count-bigup').unbind();
        $('#star-reload').unbind();
        $('input:radio[name=colorRadio]').unbind(); 
      }
    }
  },{parse:true});
  
  //cludge to allow assignment of values to starData prior to template unpacking
  for(var prop in starTemplate){
    base[prop] = starTemplate[prop];
  }
  
  NS.starData.getStars = function (maxDist){
    base.minList = [];
    //$('#star-loading').show(250);
    $.ajax({
      beforeSend: function(jqXHR){
        $('#star-loading').show(250);
        $('#star-progress').show(50);
        $('#star-progress-bar').width('0%');
        return jqXHR;
      },
      url:'http://api.danheidel.net/stars?dist=' + maxDist + '&fields=min',
      xhr: function(){
        //add progress bar hooks to XHR generation
        var xhr = $.ajaxSettings.xhr();
        try{
          xhr.addEventListener('progress', function(e){
            if(e.lengthComputable){
              $('#star-progress-bar').width(Math.round(e.loaded/e.total * 100) + '%');
              console.log(Math.round(e.loaded/e.total * 100) + '% of: ' + e.total);
            }
          }, false);
        }
        catch(err){
          //browser doesn't support progress events
          console.log(err);
        }
        finally{ return xhr; }
      },
      success: function(data, textStatus){
        _.each(data, function(element, index){
          base.minList.push(element);
        }, this);
        //alert(textStatus);
        //sort array to get 99% distrubution range of points and scale axes slightly beyond that - eliminates oversized axes from outliers
        var count = base.minList.length - 1;
        
        base.minList.sort(function(a, b){return a.AM - b.AM;});
        var yMin = base.minList[Math.round(0.01 * count)].AM;
        var yMax = base.minList[Math.round(0.99 * count)].AM;
        var ySpan = yMax - yMin;
        base.yMin = yMin - (0.3 * ySpan);
        base.yMax = yMax + (0.4 * ySpan);
        
        base.minList.sort(function(a, b){return a.CI - b.CI;});
        var xMin = base.minList[Math.round(0.01 * count)].CI;
        var xMax = base.minList[Math.round(0.99 * count)].CI;
        var xSpan = xMax - xMin;
        base.xMin = xMin - (0.15 * xSpan);
        base.xMax = xMax + (0.35 * xSpan);
        
        $('#star-count').text('Total stars: ' + (count + 1));
        base.resize();
        base.calcScales();
        base.drawAxes();
      },
      error: function(jqXHR, textStatus, err){
        console.log(err);
      },
      complete: function(){
        //called regardless of success/error
        $('#star-loading').hide(250);
        $('#star-progress').hide(250);
      }
    });
  }
  
  NS.starData.countStars = function(maxDist, callback){
    var count;
    var jqxhr = $.get('http://api.danheidel.net/stars?dist=' + maxDist + '&fields=count',
      function(data){
        count = data.count;
      }
    );
    jqxhr.done(function(){
      callback(count);
    });
    jqxhr.fail(function(err){
      console.log(err);
    });
    return count;
  }
  
  NS.starData.resize = function(event){
    var winX = $(window).innerWidth();
    var winY = $(window).innerHeight();
    var parY = winY - base.$svg.offset().top;
    var xBorder = base.$svg.outerWidth() - base.$svg.innerWidth();
    var yBorder = base.$svg.outerHeight() - base.$svg.innerHeight();
    
    /*base.$svg.width(winX>600 ? winX - xBorder - (base.outerMargin.left + base.outerMargin.right) : 600);
    base.$svg.height(winY>400 ? parY - yBorder - (base.outerMargin.top + base.outerMargin.bottom) : 400);
    
    base.canvas.width = winX>600 ? winX - xBorder - (base.outerMargin.left + base.outerMargin.right) : 600;
    base.canvas.height = winY>400 ? parY - yBorder - (base.outerMargin.top + base.outerMargin.bottom) : 400;*/
    
    base.$svg.width(winX - xBorder - (base.outerMargin.left + base.outerMargin.right));
    base.$svg.height(parY - yBorder - (base.outerMargin.top + base.outerMargin.bottom));
    
    base.canvas.width = winX - xBorder - (base.outerMargin.left + base.outerMargin.right);
    base.canvas.height = parY - yBorder - (base.outerMargin.top + base.outerMargin.bottom);
    
    base.svgToCanvasX = (base.canvas.width) / (base.svgX);
    base.svgToCanvasY = (base.canvas.height) / (base.svgY);
      
    //convert svg margins to canvas coords
    base.canvasMargin.left = base.innerMargin.left * base.svgToCanvasX;
    base.canvasMargin.right = base.innerMargin.right * base.svgToCanvasX;
    
    base.canvasMargin.top = base.innerMargin.top * base.svgToCanvasY;
    base.canvasMargin.bottom = base.innerMargin.bottom * base.svgToCanvasY;
    
    //set of scales for mapping svg coords to canvas
    base.xCanvasScale = d3.scale.linear()
      .domain([base.xMin, base.xMax])
      .range([base.canvasMargin.left, base.canvas.width - base.canvasMargin.right]);
      
    base.yCanvasScale = d3.scale.linear()
      .domain([base.yMin, base.yMax])
      .range([base.canvasMargin.top, base.canvas.height - base.canvasMargin.bottom]);
    
    base.drawBGStars();
  };
  
  NS.starData.calcScales = function(){
    //calculate the data -> svg and data -> canvas conversion scales
    base.xSvgScale = d3.scale.linear()
      .domain([base.xMin, base.xMax])
      .range([base.innerMargin.left, base.svgX - base.innerMargin.right]);
    
    base.ySvgScale = d3.scale.linear()
      .domain([base.yMin, base.yMax])
      .range([base.innerMargin.top, (base.svgY - base.innerMargin.bottom) ]); //fudge to keep axes from overlapping
  }
  
  NS.starData.drawAxes = function(){
    //color index x axis
    base.xAxis = d3.svg.axis()
      .scale(base.xSvgScale)
      .ticks(12)
      .orient('bottom');
    
    base.d3Svg
      .selectAll('g.x.axis')
      .attr('transform', 'translate(0, ' + (base.svgY - base.innerMargin.bottom - 20) + ')')
      .call(NS.starData.xAxis);
    
    //absolute magnitude y axis
    base.yAxis = d3.svg.axis()
      .scale(base.ySvgScale)
      .ticks(10)
      .orient('left');
    
    base.d3Svg
      .selectAll('g.y.axis')
      .attr('transform', 'translate(' + (base.innerMargin.left + 20) + ', 0)')
      .call(NS.starData.yAxis);
      
    //main graph title
    base.d3Svg
      .selectAll('#star-title')
      .attr('x', base.svgX / 2)
      .attr('y', base.innerMargin.top * 2)
      .text('Hertzsprung-Russell diagram of stars within ' + base.starDistance + ' parsecs');
    
    //axis labels
    base.d3Svg
      .selectAll('text.x.axis-label')
      .attr('x', base.svgX / 2)
      .attr('y', base.svgY - (base.innerMargin.bottom / 3));
      
    base.d3Svg
      .selectAll('text.y.axis-label')
      .attr('x',  0 - (base.svgY / 2))
      .attr('y', base.innerMargin.left / 2);
      
    //loaded star count
    base.d3Svg
      .selectAll('#star-count')
      .attr('x', base.innerMargin.left / 2)
      .attr('y', base.svgY - (base.innerMargin.bottom / 3));
  }

  NS.starData.drawRegions = function(){
    //stellar spectral class axis    
    base.d3Svg
      .selectAll('.class.sub-title');
      
    
  }
  
  NS.starData.drawBGStars = function(){
    //draw points
    var colorRadio = $('input:radio[name=colorRadio]:checked').val();
    
    base.minList.forEach(
      function(data){
        if(colorRadio == 'true'){base.context.fillStyle = base.calcColor(data.CI).color;}
        else{base.context.fillStyle = base.calcColor(data.CI).bright;}
        base.context.fillRect(base.xCanvasScale(data.CI), base.yCanvasScale(data.AM), 1, 1);
      }
    );
    /*var bgStars = base.bgStars = d3
      .select('#star-svg')
      .selectAll('circle');
      
    base.starD3 = bgStars
      .data(base.minList);

    base.starD3.enter().append('circle')
      .attr('cx', function(elem){return base.xScale(elem.CI);})
      .attr('cy', function(elem){return base.yScale(elem.AM);})
      .attr('r', 1.5)
      .attr('fill', function(elem){return base.calcColor(elem.CI);})
      .attr('opacity', 0.7);
      
    base.starD3.exit().remove();*/
  };
  
  NS.starData.testAlign = function(){
    for(var rep=-0.2;rep<=2.6;rep +=0.2){
      for(var rep2=-4;rep2<=20;rep2+=2){
        base.context.fillStyle = '#ff0000';
        base.context.fillRect(base.xCanvasScale(rep), base.yCanvasScale(rep2), 3, 3);
        base.d3Svg.append('circle')
          .attr('cx', function(elem){return base.xSvgScale(rep);})
          .attr('cy', function(elem){return base.ySvgScale(rep2);})
          .attr('r', 3.5)
          .attr('fill', '#00ff00')
          .attr('opacity', 0.7);
      }
    }
  }

    //RGB values derived from: http://www.vendian.org/mncharity/dir3/starcolor/details.html
    //spectral types from same source with considerable estimation to fill gaps
  NS.starData.colorData = [
    {BV:-0.60, trueRGB:'#8eaeff', brightRGB:'#4f77ff', temp:200000, type:'W'}, //extrapolated data for linear interpolation
    {BV:-0.40, trueRGB:'#9bb2ff', brightRGB:'#5e7cff', temp:113017, type:'O0'},
    {BV:-0.35, trueRGB:'#9eb5ff', brightRGB:'#6280ff', temp:56701, type:'O3'},
    {BV:-0.32, trueRGB:'#a2b8ff', brightRGB:'#6785ff', temp:38000, type:'O5'},
    {BV:-0.30, trueRGB:'#a3b9ff', brightRGB:'#6886ff', temp:33605, type:'B0'},
    {BV:-0.25, trueRGB:'#aabfff', brightRGB:'#718fff', temp:22695, type:'B1'},
    {BV:-0.20, trueRGB:'#b2c5ff', brightRGB:'#7c98ff', temp:16954, type:'B3'},
    {BV:-0.15, trueRGB:'#bbccff', brightRGB:'#89a3ff', temp:13674, type:'B5'},
    {BV:-0.12, trueRGB:'#b9caff', brightRGB:'#86a0ff', temp:14500, type:'B7'},
    {BV:-0.10, trueRGB:'#c4d2ff', brightRGB:'#97adff', temp:11677, type:'B8'},
    {BV:-0.05, trueRGB:'#ccd8ff', brightRGB:'#a3b7ff', temp:10395, type:'B9'},
    {BV:0.00, trueRGB:'#d3ddff', brightRGB:'#afc0ff', temp:9531, type:'A0'},
    {BV:0.05, trueRGB:'#dae2ff', brightRGB:'#bac8ff', temp:8917, type:'A3'},
    {BV:0.10, trueRGB:'#dfe5ff', brightRGB:'#c3ceff', temp:8455, type:'A4'},
    {BV:0.15, trueRGB:'#e4e9ff', brightRGB:'#ccd5ff', temp:8084, type:'A5'},
    {BV:0.20, trueRGB:'#e9ecff', brightRGB:'#d5daff', temp:7767, type:'A7'},
    {BV:0.25, trueRGB:'#eeefff', brightRGB:'#dee0ff', temp:7483, type:'A9'},
    {BV:0.30, trueRGB:'#f3f2ff', brightRGB:'#fffcff', temp:7218, type:'F0'},
    {BV:0.35, trueRGB:'#f8f6ff', brightRGB:'#fffbff', temp:6967, type:'F2'},
    {BV:0.40, trueRGB:'#fef9ff', brightRGB:'#fff5ff', temp:6728, type:'F4'},
    {BV:0.45, trueRGB:'#fff9fb', brightRGB:'#fff3f7', temp:6500, type:'F5'},
    {BV:0.50, trueRGB:'#fff7f5', brightRGB:'#ffefeb', temp:6285, type:'F7'},
    {BV:0.55, trueRGB:'#fff5ef', brightRGB:'#ffebe0', temp:6082, type:'F8'},
    {BV:0.60, trueRGB:'#fff3ea', brightRGB:'#ffe8d7', temp:5895, type:'G0'},
    {BV:0.63, trueRGB:'#fff1e7', brightRGB:'#ffe4d1', temp:5780, type:'G2'}, //the sun
    {BV:0.65, trueRGB:'#fff1e5', brightRGB:'#ffe4ce', temp:5722, type:'G5'},
    {BV:0.70, trueRGB:'#ffefe0', brightRGB:'#ffe0c5', temp:5563, type:'G6'},
    {BV:0.75, trueRGB:'#ffeddb', brightRGB:'#ffdcbc', temp:5418, type:'G8'},
    {BV:0.80, trueRGB:'#ffebd6', brightRGB:'#ffd9b4', temp:5286, type:'K0'},
    {BV:0.85, trueRGB:'#ffe9d2', brightRGB:'#ffd5ad', temp:5164, type:'K1'},
    {BV:0.90, trueRGB:'#ffe8ce', brightRGB:'#ffd3a6', temp:5052, type:'K2'},
    {BV:0.95, trueRGB:'#ffe6ca', brightRGB:'#ffcfa0', temp:4948, type:'K2'},
    {BV:1.00, trueRGB:'#ffe5c6', brightRGB:'#ffce9a', temp:4849, type:'K3'},
    {BV:1.05, trueRGB:'#ffe3c3', brightRGB:'#ffca95', temp:4755, type:'K3'},
    {BV:1.10, trueRGB:'#ffe2bf', brightRGB:'#ffc88f', temp:4664, type:'K4'},
    {BV:1.15, trueRGB:'#ffe0bb', brightRGB:'#ffc589', temp:4576, type:'K5'},
    {BV:1.20, trueRGB:'#ffdfb8', brightRGB:'#ffc385', temp:4489, type:'K5'},
    {BV:1.25, trueRGB:'#ffddb4', brightRGB:'#ffc07f', temp:4405, type:'K6'},
    {BV:1.30, trueRGB:'#ffdbb0', brightRGB:'#ffbc79', temp:4322, type:'K7'},
    {BV:1.35, trueRGB:'#ffdaad', brightRGB:'#ffba75', temp:4241, type:'K8'},
    {BV:1.40, trueRGB:'#ffd8a9', brightRGB:'#ffb770', temp:4159, type:'M0'},
    {BV:1.45, trueRGB:'#ffd6a5', brightRGB:'#ffb46b', temp:4076, type:'M1'},
    {BV:1.50, trueRGB:'#ffd5a1', brightRGB:'#ffb266', temp:3989, type:'M2'},
    {BV:1.55, trueRGB:'#ffd29c', brightRGB:'#ffad5f', temp:3892, type:'M3'},
    {BV:1.60, trueRGB:'#ffd096', brightRGB:'#ffaa58', temp:3779, type:'M5'},
    {BV:1.65, trueRGB:'#ffcc8f', brightRGB:'#ffa350', temp:3640, type:'M5'},
    {BV:1.70, trueRGB:'#ffc885', brightRGB:'#ff9d45', temp:3463, type:'M6'},
    {BV:1.75, trueRGB:'#ffc178', brightRGB:'#ff9238', temp:3234, type:'M6'},
    {BV:1.80, trueRGB:'#ffb765', brightRGB:'#ff8328', temp:2942, type:'M6'},
    {BV:1.85, trueRGB:'#ffa94b', brightRGB:'#ff7016', temp:2579, type:'M7'},
    {BV:1.90, trueRGB:'#ff9523', brightRGB:'#ff5705', temp:2150, type:'M7'},
    {BV:1.95, trueRGB:'#ff7b00', brightRGB:'#ff3b00', temp:1675, type:'M8'},
    {BV:2.00, trueRGB:'#ff5200', brightRGB:'#ff1a00', temp:1195, type:'M8'},
    {BV:5.00, trueRGB:'#000000', brightRGB:'#000000', temp:0, type:'L'}, //extrapolated data for linear interpolation
    {BV:100.00, trueRGB:'#000000', brightRGB:'#000000', temp:0, type:'L'} //catch all for crazy outliers
  ];
  
  NS.starData.calcColor = function(iBV){
    function invInterp(min, max, val){
      //feeds interpolate a 0-1 value
      return (val - min) / (max - min);
    }    
    
    var intBV, intRGB, intTemp;
    var CD = base.colorData;
    
    for(var rep=1;rep<(CD.length);rep++){
      if((iBV > CD[rep-1].BV) && (iBV <= CD[rep].BV)){
        intBV = invInterp(CD[rep-1].BV, CD[rep].BV, iBV);
        intRGB = d3.interpolateRgb(CD[rep-1].trueRGB, CD[rep].trueRGB);
        intBright = d3.interpolateRgb(CD[rep-1].brightRGB, CD[rep].brightRGB);
        intTemp = d3.interpolateRound(CD[rep-1].temp, CD[rep].temp);
        return {
          color:intRGB(intBV),
          bright:intBright(intBV),
          temp:intTemp(intBV),
          type:CD[rep].type
        };
      }
    }
    return{color:'#000000', temp:0, type:'error'};  // catch all in case of some error
  }
  
  NS.starData.parsecsToLY = function(parsecs){return (parsecs * 3.262).toFixed(0);}

})(window.templateData);
