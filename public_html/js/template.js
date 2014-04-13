window.templateFunctions || (window.templateFunctions = {});

(function(NS){
  //basic parsing functions
  NS.BaseParse = Backbone.Model.extend({
    ahrefParse: function(tmplChunk, isEditor){
      var ahref = {tag:'a'};
      if('id' in tmplChunk){ahref.id = tmplChunk.id;}
      if('class' in tmplChunk){ahref.class = tmplChunk.class;}
      if('style' in tmplChunk){ahref.style = tmplChunk.style;}
      if('name' in tmplChunk){ahref.c = tmplChunk.name;}
      if('value' in tmplChunk){ahref.value = tmplChunk.value;}
      if('type' in tmplChunk){ahref.type = tmplChunk.value;}
      if('href' in tmplChunk){ahref.href = tmplChunk.href;}
      if('src' in tmplChunk){ahref.src = tmplChunk.src;}
      if('target' in tmplChunk){ahref.target = tmplChunk.target;}
      if('width' in tmplChunk){ahref.width = tmplChunk.width;}
      if('height' in tmplChunk){ahref.height = tmplChunk.height;}
      if('type' in tmplChunk){ahref.type = tmplChunk.type;}
      if('title' in tmplChunk){ahref.title = tmplChunk.title;}
      if('attr' in tmplChunk){ahref.attr = tmplChunk.attr;}
      if('content' in tmplChunk){ahref.content = tmplChunk.content;}
      if('c' in tmplChunk){ahref.c = tmplChunk.c;}
      if('img' || 'icon' in tmplChunk){ahref.chi = [];}
      if('img' in tmplChunk){
        ahref.chi.push({tag:'br'});
        ahref.chi.push({tag:'img', src:tmplChunk.img});
      }
      if('icon' in tmplChunk){ahref.chi.push({tag:'i', class:'icon-' + tmplChunk.icon + ' ' + 
        ((typeof tmplChunk.iconSize !== 'undefined')?tmplChunk.iconSize:'icon-large')});}
      if(isEditor && 'selectable' in tmplChunk){
        //assumes that all selectable menu items have unique names
        //and that there the name and func attributes are present and valid
        ('class' in tmplChunk) ? ahref.class += ' editor-item' : ahref.class = 'editor-item';
        ahref.id = 'editor-' + tmplChunk.func + '-' + tmplChunk.name;
        ahref.attr = ' data-editor-func=\'' + tmplChunk.func + '\' data-editor-args=\'' + tmplChunk.name + '\' ';
      }
      return ahref;
    }
  });

  //parsingfunctions specific to constructing menus
  NS.MenuFunctions = NS.BaseParse.extend({
    menuParse: function(omniChunk, tmplChunk){
      for(var rep=0;rep<tmplChunk.length;rep++){
        //if it's a divider
        if('divider' in tmplChunk[rep]){omniChunk.push({tag:'li', class:'divider'});}
        //if it's a regular menu element
        else if('name' in tmplChunk[rep]){
          var tempTag = {tag:'li', chi:[]};
          tempTag.chi.push(this.ahrefParse(tmplChunk[rep], true));
          //if there are sub-items
          if('chi' in tmplChunk[rep] && tmplChunk[rep].chi.length != 0){
            tempTag.class = 'has-dropdown';
            var tempDropdown = {tag:'ul',class:'dropdown', chi:[]};
            var tempChildren = this.menuParse([], tmplChunk[rep].chi);
            for(var rep2=0;rep2<tempChildren.length;rep2++){
              tempDropdown.chi.push(tempChildren[rep2]);
            }
            tempTag.chi.push(tempDropdown);
          }
          omniChunk.push(tempTag);
        }
      }
      return omniChunk;
    },
    menuCompile: function(iTemplate){
      //create base div
      var omniTemplate = {
        tag:'div',
        chi:[{
          tag:'nav',
          class:'top-bar',
          attr:' data-topbar ',
          chi:[]
        }]};
      //set if menu is floating, fixed or sticky
      if(iTemplate.placement!=''){omniTemplate.class = iTemplate.placement;}
      if(iTemplate.width=='full'){'class' in omniTemplate?omniTemplate.class += ' contain-to-grid':omniTemplate.class = 'contain-to-grid';}
      if(iTemplate.clickable==true){omniTemplate.chi[0].attr = ' data-options=\'is_hover:false\'';}

      //construct the menu title and mobile icon/bar
      var mobileTitle = {
        tag:'li',
        class:'toggle-topbar',
        chi:[]};
      if(iTemplate.mobileIcon==true){mobileTitle.class += ' menu-icon';}

      var mobileLink = {tag:'a'};
      if(iTemplate.mobileHref!=''){mobileLink.href = iTemplate.mobileHref;}
      if(iTemplate.mobileName!=''){mobileLink.c = iTemplate.mobileName;}

      mobileTitle.chi.push(mobileLink);

      var titleContent = {tag:'a'};
      if(iTemplate.title!=''){titleContent.c = iTemplate.title;}
      if(iTemplate.titleHref!=''){titleContent.href = iTemplate.titleHref;}

      var titleBar = {
        tag:'ul',
        class:'title-area',
        chi:[]};
      titleBar.chi.push({
        tag:'li',
        class:'name',
        chi:[{tag:'h1', chi:[]}]
      });
      titleBar.chi[0].chi[0].chi.push(titleContent);
      titleBar.chi.push(mobileTitle);

      omniTemplate.chi[0].chi.push(titleBar);

      var menuLeft = {
        tag:'ul',
        class:'left',
        chi:[]
      };

      iTemplate.left.push(this.menuParse(menuLeft.chi, iTemplate.left));

      var menuRight = {
        tag:'ul',
        class:'right',
        chi:[]
      };

      iTemplate.left.push(this.menuParse(menuRight.chi, iTemplate.right));

      omniTemplate.chi[0].chi.push({
        tag:'section',
        class:'top-bar-section',
        chi:[menuLeft, menuRight]
      });
      return omniTemplate;
    },
  });

  //parsing functions specific to standard Foundation 
  NS.FoundationParse = NS.MenuFunctions.extend({
    foundationCompile: function(iTemplate){return iTemplate;}
  });

  NS.BuildPage = NS.FoundationParse.extend({
    parse: function(iAttrs, options){
      var compiledMenu = {},
        attrs = {};
      if('menuTemplate' in iAttrs){compiledMenu = this.menuCompile(iAttrs.menuTemplate)};
      attrs.menu = [];
      attrs.body = [];
      attrs.funcs = {
        onLoad: function(){},
        onUnLoad: function(){}
      };
      if('menuTemplate' in iAttrs){attrs.menu.push(compiledMenu);}
      if('bodyTemplate' in iAttrs){iAttrs.bodyTemplate.forEach(function(element){attrs.body.push(element);});}
      if('funcEvents' in iAttrs){attrs.funcs = iAttrs.funcEvents;}
      return attrs;
    },
  });
  
/*
  var oGridContent = Backbone.Model.extend({
  });
   pageVars.gridContent = new oGridContent;
   var oGridView = Backbone.View.extend({
    el: '#main-content',
    model: pageVars.gridContent,
    initialize: function(){
      this.menuEl = $('#menu-content');
      this.mainEl = $('#main-content');
      this.menuSource = $('#omni-template').html();
      this.mainSource = $('#omni-template').html();
      this.menuTemplate = Handlebars.compile(this.menuSource);
      this.mainTemplate = Handlebars.compile(this.mainSource);
      this.listenTo(this.model, 'change', this.render);
    },
    render: function(){
      var tempMenu = [], tempBody = [];
      if('menu' in this.model.attributes){this.model.get('menu').forEach(function(element){tempMenu.push(element);});};
      if('body' in this.model.attributes){this.model.get('body').forEach(function(element){tempBody.push(element);});};
      if(this.onUnLoad){  //if departing template has onUnLoad(), call it
        this.onUnLoad();
      }
      this.menuContext = {'omni-content': tempMenu};
      this.mainContext = {'omni-content': tempBody};
      
      this.menuHTML = this.menuTemplate(this.menuContext);
      this.mainHTML = this.mainTemplate(this.mainContext);
      
      this.menuEl.html(this.menuHTML);
      this.mainEl.html(this.mainHTML);
      
      if('funcs' in this.model.attributes){
        //if new template has onLoad(), call it, if it has onUnLoad(), store for later call
        if(this.model.get('funcs').onLoad) this.model.get('funcs').onLoad();
        if(this.model.get('funcs').onUnLoad) this.onUnLoad = this.model.get('funcs').onUnLoad;
      }
      return this;
    }
  });

  pageVars.gridView = new oGridView;*/
  

})(window.templateFunctions);


