(function(){  //setup bgVars
   window.bgVars || (window.bgVars = {});
   bgVars.visualizations = {};
   bgVars.incompletevisualizations = {};
   bgVars.selectedBG = -1;
})();

//set up vars for game of life
(function(namespace){  //GoL
   var _Canvas = {};
   var _Ctx = {};
   var xBlockSize = 3;
   var yBlockSize = 3;
   var xBlocks = 0;
   var yBlocks = 0;
   var bornVals = [3];
   var stayAliveVals = [2, 3];
   var cGrid;
   var cGridUp;
   var cGridDown;
   var cGrid2;

   function splitMemCopy(dst, src, breakOffset){
      //creates a copy of src that is swapped at the breakOffset, effectivly 'rotating' the array
      var remainderLen = src.length - breakOffset;
      var srcOffset = new Uint8Array(src.buffer, 0, breakOffset);
      var srcRemainder = new Uint8Array(src.buffer, breakOffset, remainderLen);
      var destOffset = new Uint8Array(dst.buffer, remainderLen, breakOffset);
      var destRemainder = new Uint8Array(dst.buffer, 0, remainderLen);

      destOffset.set(srcOffset);
      destRemainder.set(srcRemainder);
   };

   function setupCalcs(){
      //sets up shifted typed arrays to speed up GoL neighbor calculation
      splitMemCopy(cGridDown, cGrid, xBlocks);
      splitMemCopy(cGridUp, cGrid, (cGrid.length - xBlocks));
   };

   function cirInd(index, mod){
      //returns modulus, array-wrapping value to implement circular array
      if(index<0){index+=mod;}
      return index%mod;
   };

   function calcNeighbors(rep){
      var foo = xBlocks;
      var grid = cGrid;
      var mod = grid.length;
      var neighbors = grid[cirInd(rep-foo-1, mod)] + grid[cirInd(rep-foo, mod)] + grid[cirInd(rep-foo+1, mod)] + grid[cirInd(rep-1, mod)] + grid[cirInd(rep+1, mod)] + grid[cirInd(rep+foo-1, mod)] + grid[cirInd(rep+foo, mod)] + grid[cirInd(rep+foo+1, mod)];
      /*var cG = cGrid;
      var cGU = cGridUp;
      var cGD = cGridDown;
      var neighbors = cGU[rep-1] + cGU[rep] + cGU[rep+1] + cG[rep-1] + cG[rep+1] + cGD[rep-1] + cGD[rep] + cGD[rep+1];*/
      return neighbors;
   };

   function lifeRules(rep, neighbors){
         cGrid2[rep] = 0;
         if(cGrid[rep] == 1){  //stay alive rules
            for(var rep2=0;rep2<stayAliveVals.length;rep2++){
               if(neighbors==stayAliveVals[rep2]){cGrid2[rep] = 1;}
            }
         }
         if(cGrid[rep] == 0){  //'born' rules
            for(var rep2=0;rep2<bornVals.length;rep2++){
               if(neighbors==bornVals[rep2]){cGrid2[rep] = 1;}
            }
         }
   };

   function fastFillLive(){
      //console.time("init");
      var xPix = _Canvas.width;
      var yPix = _Canvas.height;
      var gArray = _Ctx.imageData.data;
      //gArray is a Uint8BoundedArray - remap to uint32 for block manipulation
      var gArray32 = new Uint32Array(gArray.buffer);

      //define pixel data block for a live pixel
      var live8 = new Uint8Array(4);
      live8[0] = 140;
      live8[3] = 255;
      var subLive32 = new Uint32Array(live8.buffer);
      var live32 = new Uint32Array(xBlockSize); //length in 32 bit chunks
      for(var rep = 0;rep<xBlockSize;rep++){
         live32.set(subLive32, rep);
      }

      //define pixel data block for a dead pixel
      var dead8 = new Uint8Array(4);
      dead8[0] = 100;
      dead8[3] = 255;
      var subDead32 = new Uint32Array(dead8.buffer);
      var dead32 = new Uint32Array(xBlockSize);
      for(var rep=0;rep<xBlockSize;rep++){
         dead32.set(subDead32, rep);
      }

      //set up uint32 array to hold entire row pixel data at once
      var row32 = new Uint32Array(xPix);
      var rowLen = row32.length;
      var block32Len = live32.length;
      var clampXBlocks = (xPix/xBlockSize)>>0; //bitwise Math.floor

      var yOffset;

      //console.timeEnd('init');
      //console.time('copy');

      for(var yBlockRep=0; yBlockRep<yBlocks; yBlockRep++){
         //console.time('live');
         yOffset = yBlockRep * xBlocks;
         for(var xBlockRep=0; xBlockRep<clampXBlocks; xBlockRep++){
            if(cGrid[xBlockRep + yOffset] == 0){
               row32.set(dead32, xBlockRep * block32Len);
            }
            else{
               row32.set(live32, xBlockRep * block32Len);
            }
         }
         //console.timeEnd('live');
         //console.time('block');
         for(var yBlockSizeRep=0; yBlockSizeRep<yBlockSize; yBlockSizeRep++){
            if((yBlockSizeRep + (yBlockRep * yBlockSize)) < yPix){
               gArray32.set(row32, rowLen * (yBlockSizeRep + (yBlockRep * yBlockSize)));
            }
         }
         //console.timeEnd('block');
      }
      //console.timeEnd('copy');
      //console.time('render');
      _Ctx.putImageData(_Ctx.imageData, 0, 0);
      //_Ctx.drawImage(_Ctx.imageData, 0, 0);
      //console.timeEnd('render');
   };

   namespace.name = "Game of Life";
   namespace.about = "This is the famous Conway Game of Life";
   namespace.control = {
      mainContent: [
         {tag:"h4",
         c:"This background visualization is Game of Life."},
         {tag:"p",
         c:"It is a recreation of the famous cellular automata algorithm created by John Conway."},
         {tag:"h4",
         c:"Choose a background visualization!"},
         {},
         {tag:"a", class:"close-reveal-modal", c:"X"},
         {tag:"div",
         class:"panel",
         children:[
            {tag:"p",
            id:"bgVizOptionsGoLGridsize",
            c:"Adjust the gridsize. Current gridsize = " + this.xBlockSize},
            {tag:"p",
            c:"Warning - gridsize of 1 will run very slowly"},
            {tag:"input",
            type:"checkbox",
            name:"foo",
            value:"foo"},
         ]}
      ]
   },
   namespace.initBgVars = function(iCanvas, iCtx){
      var seedVals = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 39, 43, 47];
      _Canvas = iCanvas;
      _Ctx = iCtx;
      xBlocks = Math.round(_Canvas.width/xBlockSize) + 1;
      yBlocks = Math.round(_Canvas.height/yBlockSize) + 1;
      cGrid = new Uint8Array(xBlocks * yBlocks);
      for(var rep=0;rep<(xBlocks * yBlocks);rep++){
         cGrid[rep] = rep%seedVals[rep%(seedVals.length)]%2;
      }
      cGridUp = new Uint8Array(xBlocks * yBlocks);
      cGridDown = new Uint8Array(xBlocks * yBlocks);
      cGrid2 = new Uint8Array(xBlocks * yBlocks);
   };
   namespace.userInput = function(event){
      //console.log(event);
      var gridX = Math.round(event.clientX / xBlockSize);
      var gridY = Math.round(event.clientY / yBlockSize);
      cGrid[gridX + (gridY * xBlocks)] = 1;
   };
   namespace.updateBgCanvas = function(){
      //convert grid data to graphics data for drawing
      //console.time('fastFill');
      fastFillLive();
      //console.timeEnd('fastFill');

      //calculate next generation to buffer
      //console.time('calcsetup');
      //setupCalcs();
      //console.timeEnd('calcsetup');
      //console.time('calcs');
      var neighbors = 0;
      var cLength = cGrid.length;
      for(var rep=0;rep<cLength;rep++){
         //add up the live squares in the 8 neighbor blocks
         neighbors = calcNeighbors(rep);
         //implement GoL ruleset
         lifeRules(rep, neighbors);
      }
      //console.timeEnd('calcs');
      //seed with random noise to keep dynamic and copy to display buffer
      //console.time('random');
      for(var rep=0;rep<cLength;rep++){
         if(Math.random()<0.0002){cGrid2[rep] = 1;}
      }
      //console.timeEnd('random');
      //copy calculate next gen values back into working array
      cGrid.set(cGrid2);
   };
})(bgVars.visualizations.GoL = bgVars.visualizations.GoL || {});

//*****************************************************************************************************************

(function(namespace){  //lattice
   var _Canvas = {};
   var _Ctx = {};
   var lCanvas = [];
   var lCtx = [];
   var rCanvas = document.createElement('canvas');
   var rCtx = rCanvas.getContext('2d');
   var animationFrame = 0;
   var numFrames = 24;
   var aGrid = [];
   var gridSize = 50;
   var rowHeight;
   var radius;
   var kT = 0.15;
   var dissipation = 0.70; //energy loss factor per round //.87
   var dissCycle = 0;
   var bgColor = "rgb(100, 0, 0)";


   function dist(dX, dY){
      var distMag = Math.sqrt((dX * dX) + (dY * dY));
      return distMag;
   };

   function calcThermal(atom){
      //simulates Brownian motion noise
      atom.ddX += ((Math.random()*2)>>0 == 0) ? kT * Math.pow(Math.random(), 2) : -kT * Math.pow(Math.random(), 2);
      atom.ddY += ((Math.random()*2)>>0 == 0) ? kT * Math.pow(Math.random(), 2) : -kT * Math.pow(Math.random(), 2);
   };

   function calcNeighborForce(atom){
      //sums up the respulsive forces from neighbors
      var dX, dY, mag;
      var tweak = .15;
      var dDeltaX = 0, dDeltaY = 0;
      for(var rep=0;rep<atom.neighbors.length;rep++){
         dX = (atom.x - atom.neighbors[rep].x);
         dY = (atom.y - atom.neighbors[rep].y);
         mag = (gridSize - dist(dX, dY)) / gridSize;
         if(atom.neighbors[rep].isRepulsor > atom.isRepulsor){
            atom.isRepulsor = atom.neighbors[rep].isRepulsor - 1;;
            mag += 1;
         }

         dDeltaX += (dX * mag);
         dDeltaY += (dY * mag);
      }
      atom.ddX += dDeltaX * tweak;
      atom.ddY += dDeltaY * tweak;
   };

   function cheatToHome(atom){
      //cheat hack to force atoms to move back towards the original grid positions if they move too far
      var dX, dY, mag;
      var tweak = 1.1; //relative homing force at gridSize distance from original spot
      dX = atom.x - atom.oX;
      dY = atom.y - atom.oY;
      mag = dist(dX, dY) / gridSize * tweak;
      atom.ddX -= dX * mag;
      atom.ddY -= dY * mag;
   }

   function clampEnergy(atom){
      //extra energy dampening if energy is too high
      var velClamp = 2.5;
      var accClamp = 2.0
      atom.dX = Math.min(atom.dX, velClamp);
      atom.dY = Math.min(atom.dY, velClamp);
      atom.ddX = Math.min(atom.ddX, accClamp);
      atom.ddY = Math.min(atom.ddY, accClamp);
   }

   function drawAtom(atom){
      var offsetX = lCanvas[0].width / 2;
      var offsetY = lCanvas[0].height / 2;
      if(atom.isFixed == false){
            atom.ddX = 0;
            atom.ddY = 0;
            atom.dX *= (dissipation);
            atom.dY *= (dissipation);
            calcThermal(atom);
            calcNeighborForce(atom);
            cheatToHome(atom);
            clampEnergy(atom);
            atom.dX += atom.ddX;
            atom.x += atom.dX;
            atom.dY += atom.ddY;
            atom.y += atom.dY;
         };
         if(atom.isRepulsor > 0){
            //atom.isRepulsor--;
            _Ctx.drawImage(rCanvas, atom.x - offsetX, atom.y - offsetY, rCanvas.width, rCanvas.height);
         }
         else{
            _Ctx.drawImage(lCanvas[(atom.n + animationFrame)%numFrames], atom.x - offsetX, atom.y - offsetY, lCanvas[0].width, lCanvas[0].height);
         }
         if(Math.random() < 0.00006) {atom.isRepulsor = 5;}
   }

   function drawSprites(){
      //setup offscreen canvases
      for(var rep=0;rep<numFrames;rep++){
         lCanvas.push(document.createElement('canvas'));
         lCanvas[rep].width = (2 * radius) + 2;
         lCanvas[rep].height = (2 * radius) + 2;
         lCtx.push(lCanvas[rep].getContext('2d'));

         lCtx[rep].translate(lCanvas[rep].width / 2, lCanvas[rep].height / 2);
         lCtx[rep].rotate(rep * (Math.PI * 2 / numFrames));

         //draw atom to copy
         lCtx[rep].beginPath();
         lCtx[rep].arc(0, 0, radius - 9, 0, Math.PI*2, false);
         lCtx[rep].fillStyle = "#222";
         lCtx[rep].fill();
         lCtx[rep].closePath();

         lCtx[rep].beginPath();
         lCtx[rep].arc(0, radius - 4, 3, 0, Math.PI*2, false);
         lCtx[rep].fillStyle = "#222";
         lCtx[rep].fill();
         lCtx[rep].closePath();

         lCtx[rep].beginPath();
         lCtx[rep].lineWidth = 2;
         lCtx[rep].strokeStyle = "#222";
         lCtx[rep].arc(0, 0, radius - 4, 0, Math.PI*2, false);
         lCtx[rep].stroke();
         lCtx[rep].closePath();
      }

      //setup offscreen canvas for highlight
      rCanvas.width = (2 * radius) + 2;
      rCanvas.height = (2 * radius) + 2;
      rCtx.arc(rCanvas.width/2, rCanvas.height/2,radius, 0, Math.PI*2, false);
      rCtx.fillStyle = "#a22";
      rCtx.fill();
   }

   function dampenCycle(){
      //cycles the dissipation constand and background color over time
      var invDiss = (dissCycle + 180) % 360;
      dissipation = 0.78 + 0.1 * (Math.cos((Math.PI / 180) * dissCycle)); // 1 degree per cycle
      bgColor = 'rgb(' + (((Math.cos((Math.PI / 180 ) * dissCycle) * 54) << 0) + 55) + ', ' + (((Math.cos((Math.PI / 180) * invDiss) * 44) << 0) + 45) + ', ' + (((Math.cos((Math.PI / 180) * invDiss) * 49) << 0) + 50) + ')';
      dissCycle += 0.35;
      dissCycle %= 360;
   }

   function findNeighbors(){
      var tempDist;
      var tempX, tempY;
      var modGridSize = gridSize * 1.2;
      var tempNeighbors = [];
      for(var rep=0;rep<aGrid.length;rep++){
         tempX = aGrid[rep].x;
         tempY = aGrid[rep].y;
         for(var rep2=0;rep2<aGrid.length;rep2++){
            tempDist = dist(tempX - aGrid[rep2].x, tempY - aGrid[rep2].y);
            if(tempDist != 0 && tempDist < modGridSize){
               //not itself and within a GridSize radius of itself
               tempNeighbors.push(aGrid[rep2]);
            }
         }
         aGrid[rep].neighbors = tempNeighbors;
         tempNeighbors = [];
      }
   };

   namespace.name = "Lattice";
   namespace.about = "Simulation of lattice vibrations";
   namespace.control = {
      mainContent: [
         {tag:"h4",
         c:"The current background visualization is Lattice."},
         {tag:"p",
         c:"This is possibly the least-realistic atomic lattice vibration simulator ever made."},
         {tag:"h4",
         c:"Choose a background visualization!"},
         {},
         {tag:"a", class:"close-reveal-modal", c:"X"},
         {tag:"div",
         class:"panel",
         children:[
            {tag:"p",
            c:"No controls for this! :("}
         ]}
      ],
   };
   namespace.initBgVars = function(iCanvas, iCtx){
      _Canvas = iCanvas;
      _Ctx = iCtx;
      aGrid = [];
      radius = gridSize / 3;
      dissCycle = 0;

      drawSprites();

      var xGrid = _Canvas.width / gridSize;
      xGrid += 4;
      rowHeight = (1/Math.tan(Math.PI/6))/2*gridSize;
      var yGrid = _Canvas.height / rowHeight;
      yGrid += 4;

      var tempX, tempY;
      for(var rep=0;rep<yGrid;rep++){
         for(var rep2=0;rep2<xGrid;rep2++){
            tempX = (-2*gridSize) + (0.5*gridSize*(rep%2)) + (rep2*gridSize);
            tempY = rowHeight*rep - (2*rowHeight);
            aGrid.push({
               n: 0,
               oX: tempX,
               oY: tempY,
               x: tempX,
               y: tempY,
               dX: 0,
               dY: 0,
               ddX: 0,
               ddY: 0,
               isFixed: ((tempX> -gridSize)&&(tempY> -rowHeight)&&(tempX<_Canvas.width)&&(tempY<_Canvas.height)) ? false : true,
               isRepulsor: 0, //is repuslor if > 0
               neighbors: []
            });
         }
      }
      for(var rep=0;rep<aGrid.length;rep++){
         aGrid[rep].n = rep;
      }
      findNeighbors();
   };

   namespace.userInput = function(event){
      if(event.type == "mousedown"){
         var tempX = event.clientX;
         var tempY = event.clientY; 
         for(var rep=0;rep<aGrid.length;rep++){
            if(dist(aGrid[rep].x - tempX, aGrid[rep].y - tempY) < (radius)){
               aGrid[rep].isRepulsor = 5;
            }
         }
      }
   };

   namespace.updateBgCanvas = function(){
      //console.time('updateBgCanvas');
      //myCtx.fillStyle = "rgb(100,0,0)";
      myCtx.fillStyle = bgColor;
      myCtx.fillRect(0, 0, myCanvas.width, myCanvas.height);
      for(var rep=0;rep<aGrid.length;rep++){
         //console.time('drawMe');
         drawAtom(aGrid[rep]);
         //console.timeEnd('drawMe');
      }
      for(var rep=0;rep<aGrid.length;rep++){
         if(aGrid[rep].isRepulsor > 0){
            aGrid[rep].isRepulsor--;
         }
      }
      animationFrame++;
      animationFrame %= 24;
      dampenCycle();
      //console.time('fill');
      //console.timeEnd('fill');
      //console.timeEnd('updateBgCanvas');
   };
})(bgVars.visualizations.lattice = bgVars.visualizations.lattice || {});

//*****************************************************************************************************************

(function(namespace){  //boids
   var _Canvas = {};
   var _Ctx = {};
   var fArray = [];

   namespace.name = "Flock";
   namespace.about = "This is a 2D version of the famous 1984 flock simulator Boids";
   namespace.control = {
      mainContent: [
         {tag:"h4",
         c:"The current background visualization is Flock."},
         {tag:"p",
         c:"This is a variant of the famous 1986 flocking behavior simulator Boids created by Craig Reynolds."},
         {tag:"h4",
         c:"Choose a background visualization!"},
         {},
         {tag:"a", class:"close-reveal-modal", c:"X"},
         {tag:"div",
         class:"panel",
         children:[
            {tag:"p",
            c:" "}
         ]}
      ]
   },
   namespace.initBgVars = function(iCanvas, iCtx){
   };
   namespace.userInput = function(event){
   };
   namespace.updateBgCanvas = function(){
   };
})(bgVars.incompletevisualizations.flock = bgVars.incompletevisualizations.flock || {});

//*****************************************************************************************************************

bgVars.initBG = function(elem){
   var oBgModel = Backbone.Model.extend({
      defaults: {"main-content": ""}
   })

   bgVars.bgModel = new oBgModel;

   var oBgView = Backbone.View.extend({
      el: elem,
      model:bgVars.bgModel,
      defaults: {
         bgSource: "",
         bgTemplate: "",
         bgContext: "",
         bgHTML: ""
      },
      initialize: function(){
         this.bgSource = $('#omni-template').html();
         this.bgTemplate = Handlebars.compile(this.bgSource);
         this.listenTo(this.model, "change", this.render);
      },
      render: function(){
         this.bgContext = {
            "omni-content": this.model.get("mainContent")
         };

         this.bgHTML = this.bgTemplate(this.bgContext);
         this.el.innerHTML = this.bgHTML;

         $('#bgVizSelect').on({
            focus: function(event){
               event.currentTarget.selectedIndex = bgVars.selectedBG;
            },
            change: function(event){
               bgVars.selectBG(event.currentTarget.selectedIndex);
               bgVars.initBgVars(myCanvas, myCtx);
            }
         });
      
      return this;
      }         
   });

   bgVars.bgView = new oBgView;

   bgVars.vizList = [];

   _.each(bgVars.visualizations, function(element){
      bgVars.vizList.push(element.name);
   });

   var tempRow = 
      {tag:"div",
      class:"row",
      children:[
         {tag:"select",
         id:"bgVizSelect",
         name:"visualization",
         //attr:" onchange=\"alert('change');\"",
         children:[
         ]}       
      ]};

   _.each(bgVars.vizList, function(element, index){
      tempRow.children[0].children.push({
         tag:"option",
         id:("bgVizOption"+index),
         value:index,
         c:element,
      });
   });

   _.each(bgVars.visualizations, function(element){
      element.control.mainContent[3] = tempRow;
   });
}

bgVars.selectBG = function(selector){
   selectedBG = selector;
   var vizName = bgVars.vizList[selector%(_.size(bgVars.vizList))];
   var viz = _.find(bgVars.visualizations, function(element){return (element.name == vizName);});

   bgVars.name = viz.name;
   bgVars.about = viz.about;
   bgVars.initBgVars = viz.initBgVars;
   bgVars.userInput = viz.userInput;
   bgVars.updateBgCanvas = viz.updateBgCanvas;
   bgVars.bgModel.set(viz.control);
};