window.templateFunctions || (window.templateFunctions = {});

(function(NS){
  //basic parsing functions
  NS.BaseParse = Backbone.Model.extend({
    iconParse: function(tmplChunk, isEditor){
      //asssumes the tmplChunk has already been tested to contain icon data
      var icon = {
        tag:"li",
        chi:[
          {tag:"a",
          c:" icon-" + tmplChunk.icon,
          chi:[
            {tag:"i",
            class:"icon-" + tmplChunk.icon + " icon-2x"}
          ]}
      ]};
      if(isEditor){
        //makes the assumption that the icon name is same as the associated function 
        icon.chi[0].id = "editor-icon-" + tmplChunk.icon;
        icon.chi[0].class = "editor-item";
        icon.chi[0].attr = " data-editor-func=\"icon\" data-editor-args=\"" + tmplChunk.icon + "\" ";
      }
      return icon;
    },
    ahrefParse: function(tmplChunk, isEditor){
      var ahref = {tag:"a"};
      if("name" in tmplChunk){ahref.c = tmplChunk.name;}
      if("href" in tmplChunk){ahref.href = tmplChunk.href;}
      if("class" in tmplChunk){ahref.class = tmplChunk.class;}
      if("id" in tmplChunk){ahref.id = tmplChunk.id;}
      if("children" in tmplChunk || "chi" in tmplChunk || "img" in tmplChunk){ahref.chi = [];}
      if("children" in tmplChunk) {tmplChunk.children.forEach(function(element){ahref.chi.push(element);});}
      if("chi" in tmplChunk) {tmplChunk.chi.forEach(function(element){ahref.chi.push(element);});}
      if("img" in tmplChunk){ahref.chi.push({tag:"img", src:tmplChunk.img});}
      if(isEditor && "selectable" in tmplChunk){
        //assumes that all selectable menu items have unique names
        //and that there the name and func attributes are present and valid
        ("class" in tmplChunk) ? ahref.class += " editor-item" : ahref.class = "editor-item";
        ahref.id = "editor-" + tmplChunk.func + "-" + tmplChunk.name;
        ahref.attr = " data-editor-func=\"" + tmplChunk.func + "\" data-editor-args=\"" + tmplChunk.name + "\" ";
      }
      return ahref;
    }
  });

  //parsingfunctions specific to constructing menus
  NS.MenuFunctions = NS.BaseParse.extend({
    menuParse: function(omniChunk, tmplChunk){
      for(var rep=0;rep<tmplChunk.length;rep++){
        //if it's a divider
        if("divider" in tmplChunk[rep]){omniChunk.push({tag:"li", class:"divider"});}
        //if it's a regular menu element
        else if("name" in tmplChunk[rep]){
          var tempTag = {tag:"li", chi:[]};
          tempTag.chi.push(this.ahrefParse(tmplChunk[rep], true));
          //if there are sub-items
          if("children" in tmplChunk[rep] && tmplChunk[rep].children.length != 0){
            tempTag.class = "has-dropdown";
            var tempDropdown = {tag:"ul",class:"dropdown", chi:[]};
            var tempChildren = this.menuParse([], tmplChunk[rep].children);
            for(var rep2=0;rep2<tempChildren.length;rep2++){
              tempDropdown.chi.push(tempChildren[rep2]);
            }
            tempTag.chi.push(tempDropdown);
          }
          omniChunk.push(tempTag);
        }
        //font awesome handling
        else if("icon" in tmplChunk[rep]){
          omniChunk.push(this.iconParse(tmplChunk[rep], true));
        }
      }
      return omniChunk;
    },
    menuCompile: function(iTemplate){
      //create base div
      var omniTemplate = {
        tag:"div",
        chi:[{
          tag:"nav",
          class:"top-bar",
          chi:[]
        }]};
      //set if menu is floating, fixed or sticky
      if(iTemplate.placement!=""){omniTemplate.class = iTemplate.placement;}
      if(iTemplate.width=="full"){"class" in omniTemplate?omniTemplate.class += " contain-to-grid":omniTemplate.class = "contain-to-grid";}
      if(iTemplate.clickable==true){omniTemplate.chi[0].attr = " data-options=\"is_hover:false\"";}

      //construct the menu title and mobile icon/bar
      var mobileTitle = {
        tag:"li",
        class:"toggle-topbar",
        chi:[]};
      if(iTemplate.mobileIcon==true){mobileTitle.class += " menu-icon";}

      var mobileLink = {tag:"a"};
      if(iTemplate.mobileHref!=""){mobileLink.href = iTemplate.mobileHref;}
      if(iTemplate.mobileName!=""){mobileLink.c = iTemplate.mobileName;}

      mobileTitle.chi.push(mobileLink);

      var titleContent = {tag:"a"};
      if(iTemplate.title!=""){titleContent.c = iTemplate.title;}
      if(iTemplate.titleHref!=""){titleContent.href = iTemplate.titleHref;}

      var titleBar = {
        tag:"ul",
        class:"title-area",
        chi:[]};
      titleBar.chi.push({
        tag:"li",
        class:"name",
        chi:[{tag:"h1", chi:[]}]
      });
      titleBar.chi[0].chi[0].chi.push(titleContent);
      titleBar.chi.push(mobileTitle);

      omniTemplate.chi[0].chi.push(titleBar);

      var menuLeft = {
        tag:"ul",
        class:"left",
        chi:[]
      };

      iTemplate.left.push(this.menuParse(menuLeft.chi, iTemplate.left));

      var menuRight = {
        tag:"ul",
        class:"right",
        chi:[]
      };

      iTemplate.left.push(this.menuParse(menuRight.chi, iTemplate.right));

      omniTemplate.chi[0].chi.push({
        tag:"section",
        class:"top-bar-section",
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
      var attrs = {};
      attrs.menu = [];
      attrs.body = [];
      attrs.funcs = {};
      if("menuTemplate" in iAttrs){attrs.menu.push(this.menuCompile(iAttrs.menuTemplate));}
      if("bodyTemplate" in iAttrs){attrs.body.push(this.foundationCompile(iAttrs.bodyTemplate));}
      if("funcEvents" in iAttrs){attrs.funcs = iAttrs.funcEvents;}
      return attrs;
    },
  });

})(window.templateFunctions);

window.templateData = {};
templateData.mainData = {
  body:[
    {tag:"div",
    class:"row",
    chi:[
      {panel: " ",
      colClass: "large-8",                  
      chi:[
        {tag:"h3",c: "Hey, I'm Dan, this is my stuff!",},
        {tag:"p",content: "Hey there! C'mon in, poke around."},
        {htag:"br"},
        {tag:"p", c:"Over the last several years, I've done and made some cool stuff.  It has occurred to me that people might, at some point be interested in seeing some of that stuff."},
      ]},
      {panel: " ",
      colClass:"large-4",
      chi:[
        {tag:"h4",c:"Who the hell is Dan?"},
        {tag:"p",c:"Dan is a nominally sentient, endothermic carbon-based life form residing in the monkey hive known as Seattle."},
        {tag:"br"}
      ]},
    ]},
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-8",
      chi:[
        {tag:"p",
        c:" ",
      }]},
      {panel:" ",
      colClass:"large-4",
      chi:[
        {tag:"p", c:"The hats he has worn include:"},
        {htag:"hr"},
        {tag:"p", c:"Molecular biologist"},
        {tag:"p", c:"Nanotech researcher"},
        {tag:"p", c:"Food safety microbiologist"},
        {tag:"p", c:"C# programmer"},
        {tag:"p", c:"Project manager"},
        {tag:"p", c:"Electronics design engineer"},
        {tag:"p", c:"Installation artwork designer"},
        {htag:"br"},
        {tag:"p", c:"He is currently moving into the world of Javascript application development.  This website is probably a decent guide to whether this has been successful at all."},
        {htag:"br"},
        {tag:"p", c:"He has also completed " + ((Date.now() - 203756400000)/86400000/365.25).toFixed(5) + " successful circumnavigations of the sun."},
        {htag:"br"},
        {tag:"p", c:"He does not usually refer to himself in the third person and is not sure why he is doing it now."}
      ]},
    ]},
  ]
};  //mainData

templateData.artData = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-4 push-8",
      chi:[
        {tag:"p", c:"Over the last few years, I have worked on a number of different artwork installation pieces in collaboration with Seattle artist Susie J. Lee."},
        {tag:"p", c:"In most cases, I was responsible for the electronics and lighting components of the artwork.  However, in some cases, I also did the complete physical design and construction of the piece."}
      ]},
      {panel:" ",
      colClass: "large-8 pull-4",
      chi:[
        {tag:"h3", c:"Installation art pieces"},
        {tag:'ul',
        class:"large-block-grid-2 small-block-grid-1",
        chi:[
          {tag:"li",
          chi:[
            {tag:"a", href: "#art-rain", 
              chi:[{tag:"img", src:"img/rainshow med thumb.png"}],
            }
          ]},
          {tag:"li",
          chi:[
            {tag:"a", href: "#art-contact", 
              chi:[{tag:"img", src:"img/contact med thumbnail.png"}],
            }
          ]},
          {tag:"li",
          chi:[
            {tag:"a", href: "#art-inspire", 
              chi:[{tag:"img", src:"img/dynamicspace med thumbnail.png"}],
            }
          ]},
          {tag:"li",
          chi:[
            {tag:"a", href: "#art-finn", 
              chi:[{tag:"img", src:"img/finnhill med thumbnail.png"}],
            }
          ]}
        ]}
      ]}
    ]}
  ]
}; //artData

templateData.rainData = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-4 push-8",
      chi:[
        {tag:"p", c:"Rain Shower was a major installation piece in the Frye Art Museum as part of the 60th anniversary gala."},
        {tag:"p", caption:"Rain Shower uses light to evoke rain and sound to explore the nature of human memory."},
      ]},
      {panel:" ",
      colClass:"large-8 pull-4",
      chi:[
        {tag:"h3", c:"Rain Shower 2012"},
        {tag:"ul",
        attr:" data-orbit",
        chi:[
          {tag:"li",chi:[
            {tag:"img", src:"img/rainshower3.jpg"},
            {tag:"div", class:"orbit-caption", content: "Photo credit: Erik Skaar"},
          ]},
          {tag:"li",chi:[
            {tag:"img", src:"img/rainshower1.jpg"},
            {tag:"div", class:"orbit-caption", content: "Photo credit: Erik Skaar"},
          ]},
          {tag:"li",chi:[
            {tag:"img", src:"img/rainshower2.jpg"},
            {tag:"div", class:"orbit-caption", content: "Photo credit: Erik Skaar"},
          ]},
        ]},
        {tag:"p", c:"Frye Art Museum, Susie Lee"},
        {htag:"br"},
        {tag:"p", c:"Another collaboration with Susie Lee, this piece is loosely based of an earlier, smaller work of hers."},
        {htag:"br"},
        {tag:"p", c:"Rain Shower evokes the feeling of rain by simulating raindrops by projecting modulated white light pulses onto a darkened floor.  Found sounds are projected from a distributed speakder network to further evoke the sensation of rainfall.  The rainfall ebbs and flows with recorded music and interviews to engage the viewer in an examination of our relationship with our memory of the past."},
        {htag:"br"},
        {tag:"p", c:"This piece was over 1500 sq ft of ceiling mounted steel framework with 512 high intensity LEDs.  The system was controlled by a Processing node on a PC communicating with a network of 32 custom designed Arduino clones on an RS485 differential network.  The LEDs were each individually controlled by TLC5940 ICs at each node.  32 individual speakers play directional sound in coodination with wall-mount speakers playing music and interview sound clips.  The system has full digital control over light timing, intensity, and sound."},
        {htag:"br"},
        {tag:"p", c:"For this piece, I was responsible for electronics design, fabrication, metalworking, assembly and programming."},
      ]},
    ]},
  ]
}; //rainData

templateData.contactData = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-4 push-8",
      chi:[
        {tag:"p", c:"Contact is an interactive digital art piece that combines digital communicativity with an analog electronics asthetic."},
        {tag:"p", caption:"It explores the nature of contact and human communication in a world of continuous and overwhelming connectivity."},
      ]},
      {panel:" ",
      colClass:"large-8 pull-4",
      chi:[
        {tag:"h3", c:"Contact 2012"},
        {tag:"ul",
        attr:" data-orbit",
        chi:[
          {tag:"li",chi:[
            {tag:"img", src:"img/contact part3_lbox.jpg"},
            {tag:"div", class:"orbit-caption", content: "Photo credit: Erik Skaar"},
          ]},
          {tag:"li",chi:[
            {tag:"iframe",
            src:"http:\/\/player.vimeo.com/video/25887447?byline=0&amp;portrait=0&amp;color=888888",
            width:700,
            height:420,
            attr: " frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen>"},
          ]},
          {tag:"li",chi:[
            {tag:"img", src:"img/contact part4_lbox.jpg"},
            {tag:"div", class:"orbit-caption", content: "Photo credit: Erik Skaar"},
          ]},
          {tag:"li",chi:[
            {tag:"img", src:"img/contact part5_lbox.jpg"},
            {tag:"div", class:"orbit-caption", content: "Photo credit: Erik Skaar"},
          ]},
          {tag:"li",chi:[
            {tag:"img", src:"img/contact part6_lbox.jpg"},
            {tag:"div", class:"orbit-caption", content: "Photo credit: Erik Skaar"},
          ]},
        ]},
        {tag:"p", c:"Frye Art Museum, Susie Lee"},
        {htag:"br"},
        {tag:"p", c:"Contact examines the relationship between technology, communication and ourselves in an era of sensory overstimulation.  Constructed from vintage scientific equipment and historic engineering materials, it evokes the aesthetic of vacuum-tube era computing.  However, it is an advanced digital piece capable of email, phone and SMS connectivity."},
        {htag:"br"},
        {tag:"p", c:"When contacted, the piece plays out the body of the missive in Morse code using a relay and electrically heats a piece of graphite to incandescence to signify the condensation of the entire communication to a single binary bit.  It then proceeds to randomly communicate back to the viewer over time, becoming increasingly irate if the viewer does not promptly communicate back to it."},
        {htag:"br"},
        {tag:"p", c:"Contact is an antique scientific instrumentation case with a CNC milled copper facing.  A Nokia cellphone is used to receive phone calls, texts and emails.  A bluetooth link is established to a Mac Mini which is interfaced to an Arduino with a custom manufactured MOSFET array which handles the large amperage loads for the carbon leads.  The individual elements are mechanical pencil leads held in modified hair clips and encased in borosillicate tubing.  Each element heats up to approximately 3000 F when activated."},
        {htag:"br"},
        {tag:"p", c:"For this piece, I was responsible for all physical fabrication, all custom electronics and wiring and all programming downstream of the bluetooth interface."},
      ]},
    ]},
  ]
}; //contactData

templateData.inspireData = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-4 push-8",
      chi:[
        {tag:"p", c:"Inspiratories is a glass art piece showcased at the Dynamikspace design studio.  Invoking natural color schemes, the blades of glass cycle through color cycles meant to evoke the passage of seasons."},
      ]},
      {panel:" ",
      colClass:"large-8 pull-4",
      chi:[
        {tag:"h3", c:"Inspiratories 2012"},
        {tag:"ul",
        attr:" data-orbit",
        chi:[
          {tag:"li",chi:[
            {tag:"img", src:"img/dynamicspace2.jpg"},
            {tag:"div", class:"orbit-caption", content: "Photo credit: Rodrigo Valenzuela"},
          ]},
        ]},
        {htag:"br"},
        {tag:"p", c:"This is a collaborative piece with Susie Lee and Scott \"Chico\" Rasky."},
        {htag:"br"},
        {tag:"p", c:"Each blade is individually lit and digitally controlled by a series of microcontroller nodes which communicate via networked serial to create rich, fading palates of color."},
        {tag:"p", c:"For this piece, I was responsible for all electronics, lighting and programming."},
      ]},
    ]},
  ]
}; //dynamikData

templateData.finnData = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-4 push-8",
      chi:[
        {tag:"p", c:"Finn Hill Family is a large, interactive piece installed at Finn Hill Junior High School.  It interacts with the LEED building automation electronics to communicate the amount of building resource usage to students."},
      ]},
      {panel:" ",
      colClass:"large-8 pull-4",
      chi:[
        {tag:"h3", c:"Finn Hill Junior High 2011"},
        {tag:"ul",
        attr:" data-orbit",
        chi:[
          {tag:"li",chi:[
            {tag:"img", src:"img/finnhill sculpture1 sm.jpg"},
          ]},
          {tag:"li",chi:[
            {tag:"img", src:"img/finnhill sculpture4 sm.jpg"},
          ]},
        ]},
        {htag:"br"},
        {tag:"p", c:"A collaboration with Susie Lee and Scott \"Chico\" Rasky, this installation is an environental awareness piece.  It changes lighting intensity and color over time to represent the level of resource usage such as water, electricity and heating being used in the school.  Pulling data from the building automation controllers, it can query this data in real time."},
        {htag:"br"},
        {tag:"p", c:"Each piece is cast recycled glass illuminated by a high intensity RGB LED array.  The array is powered and controlled by a custom PCB controller board and receiving information via ethernet from the building automation computers."},
        {htag:"br"},
        {tag:"p", c:"For this piece, I was responsible for all lighting and electronics as well as portions of the glass fabrication and installation."},
      ]},
    ]},
  ]
}; //finnData

templateData.electronicsData = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-4 push-8",
      chi:[
      ]},
      {panel:" ",
      colClass:"large-8 pull-4",
      chi:[
        {tag:"h3", c:"My electronics work"},
      ]},
    ]},
  ]
}; //electronicsData

templateData.cvData = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-12",
      chi:[{tag:"h2", c:"Dan Heidel"}
      ]},
    ]},
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-8",
      chi:[
        {tag:"h4", c:"Summary"},
        {tag:"p", c:"I have a wide ranging set of job experience that include C/C++/C# .Net application development, embedded electronics programming in C, electronics design, PCB design, project management and a wide variety of scientific disciplines."},
        {tag:"p", content:""}
      ]},
      {panel:" ",
      colClass: "large-4",
      chi:[
        {tag:"h4", c:"Programming Skills"},
        {tag:"hr"},
        {tag:"ul",
        class:"no-bullet",
        chi:[
          {tag:"h5", c:"Javascript"},
          {tag:"ul",
          chi:[
            {tag:"p", c:"jQuery"},
            {tag:"p", c:"Backbone"},
            {tag:"p", c:"Handlebars"},
            {tag:"p", c:"HTML5"},
            {tag:"p", c:"Canvas"},
          ]}, 
          {tag:"h5", c:"C#"},
          {tag:"h5", c:"C/C++"},
          {tag:"h5", c:"SQL"},
          {tag:"h5", c:"Assembly"},
          {tag:"ul",
          chi:[
            {tag:"p", c:"Atmel atMega"},
            {tag:"p", c:"Microchip dsPic33"},
            {tag:"p", c:"ARM Cortex M"},
          ]}, 
        ]}, //ul
        {tag:"h4", c:"Related Skills"},
        {tag:"hr"},
        {tag:"ul",
        chi:[
          {tag:"h5", c:"Project Management"},
          {tag:"h5", c:"PCB design"},
          {tag:"h5", c:"System design and integration"},
          {tag:"h5", c:"Fabrication and Metalworking"},
          {tag:"h5", c:"Supply chain design and management"},
        ]}, //ul
      ]}
    ]},
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"large-8",
      chi:[
        {tag:"h4", c:"Experience"},
        {tag:"h5", c:"Independent contractor"},
        {tag:"blockq", c:"2009-2013"},
        {tag:"p", c:"I have been doing independent computer programming and electrical engineering design for the past 3 years.  My electrical engineering work has been primarily geared towards art installation pieces in collaboration with local artists.  I have been responsible for the physical and electrical design of several local art pieces including a flagship piece featured at the Frye Art Museum 60th anniversary celebration.  I have also been working on developing my own line of wirelessly networked LED stage lighting and garden automation systems."},
      ]},
      {panel:" ",
      colClass: "large-4",
      chi:[
        {tag:"h4", c:"Education"},
        {tag:"hr"},
        {tag:"ul",
        class:"no-bullet",
        chi:[
          {tag:"h5", c:"BS Molecular and Cellular Biology"},
          {tag:"p", c:"University of Washington - 1998"},
          {htag:"br"},
          {tag:"h5", c:"PhD Materials Science and Engineering"},
          {tag:"p", c:"University of Washington - incomplete"},
          {htag:"br"},
          {tag:"h5", c:"MS Electrical Engineering"},
          {tag:"p", c:"University of Washington - ongoing"},
        ]},
      ]}
    ]},
  ],
}; //cvData

templateData.captchaRedData = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {panel:" ",
      colClass:"center-4",
      chi:[
        {tag:"a", class:"close-reveal-modal", c:"X"},
        {tag:"h3", c:"CAPTCHA TIME"},
        {tag:"p", c:"Make all the buttons red to prove you aren't a spambot!"}
      ]},
    ]},
  ],
};

templateData.captchaVerifiedContent = {
  body: [
    {tag:"div",
    class:"row",
    chi:[
      {tag:"a", class:"close-reveal-modal", c:"X"},
      {tag:"h3", c:"Congratulations!"},
      {tag:"p", c:"You are human or a very good spambot!"},
      {tag:"p", c:"Either way, here's my email address:"},
      {tag:"p", c:"dan.heidel@gmail.com"},
      {tag:"a", href:"mailto:dan.heidel@gmail.com", c:"Or click here!"}
    ]
  }],
};

templateData.editorData = new templateFunctions.BuildPage({
  menuTemplate:{
    placement:"",
    width:"full",
    clickable:"true",
    title:"JSON editor",
    titleHref:"",
    mobileIcon:true,
    mobileName:"",
    mobileHref:"",
    left:[
      {name:"edit",
      children:[
        {name:"copy",
        selectable:true,
        func:"edit"},
        {name:"paste",
        selectable:true,
        func:"edit"},
        {name:"cut",
        selectable:true,
        func:"edit"},
        {name:"delete",
        selectable:true,
        func:"edit"}
      ]},
      {name:"grid",
      children:[
        {name:"row",
        selectable:true,
        func:"grid"},
        {name:"column",
        children:[
          {name:"column-12",
          selectable:true,
          func:"grid"},
          {name:"column-11",
          selectable:true,
          func:"grid"},
          {name:"column-10",
          selectable:true,
          func:"grid"},
          {name:"column-9",
          selectable:true,
          func:"grid"},
          {name:"column-8",
          selectable:true,
          func:"grid"},
          {name:"column-7",
          selectable:true,
          func:"grid"},
          {name:"column-6",
          selectable:true,
          func:"grid"},
          {name:"column-5",
          selectable:true,
          func:"grid"},
          {name:"column-4",
          selectable:true,
          func:"grid"},
          {name:"column-3",
          selectable:true,
          func:"grid"},
          {name:"column-2",
          selectable:true,
          func:"grid"},
          {name:"column-1",
          selectable:true,
          func:"grid"},
        ]},
      ]},
      {name:"text elements"},
      {name:"Icons (Font Awesome)",
      children:[
        {name:"Web Applications",
        children:[
          {name:"1-12",
          children:[
            {icon:"adjust"},
            {icon:"anchor"},
            {icon:"archive"},
            {icon:"asterisk"},
            {icon:"ban-circle"},
            {icon:"bar-chart"},
            {icon:"barcode"},
            {icon:"beaker"},
            {icon:"beer"},
            {icon:"bell"},
            {icon:"bell-alt"},
            {icon:"bolt"},
          ]},
          {name:"13-24",
          children:[
            {icon:"book"},
            {icon:"bookmark"},
            {icon:"bookmark-empty"},
            {icon:"briefcase"},
            {icon:"bug"},
            {icon:"building"},
            {icon:"bullhorn"},
            {icon:"bullseye"},
            {icon:"calendar"},
            {icon:"calendar-empty"},
            {icon:"camera"},
            {icon:"camera-retro"},
          ]},
          {name:"25-36",
          children:[
            {icon:"certificate"},
            {icon:"check"},
            {icon:"check-empty"},
            {icon:"check-minus"},
            {icon:"check-sign"},
            {icon:"circle"},
            {icon:"circle-blank"},
            {icon:"cloud"},
            {icon:"cloud-download"},
            {icon:"cloud-upload"},
            {icon:"code"},
            {icon:"code-fork"},
          ]},
          {name:"37-48",
          children:[
            {icon:"coffee"},
            {icon:"cog"},
            {icon:"cogs"},
            {icon:"collapse"},
            {icon:"collapse-alt"},
            {icon:"collapse-top"},
            {icon:"comment"},
            {icon:"comment-alt"},
            {icon:"comments"},
            {icon:"comments-alt"},
            {icon:"compass"},
            {icon:"credit-card"},
          ]},
          {name:"49-60",
          children:[
            {icon:"crop"},
            {icon:"dashboard"},
            {icon:"desktop"},
            {icon:"download"},
            {icon:"download-alt"},
            {icon:"edit"},
            {icon:"edit-sign"},
            {icon:"ellipsis-horizontal"},
            {icon:"ellipsis-vertical"},
            {icon:"envelope"},
            {icon:"envelope-alt"},
            {icon:"eraser"},
          ]},
          {name:"61-72",
          children:[
            {icon:"exchange"},
            {icon:"exclamation"},
            {icon:"exclamation-sign"},
            {icon:"expand"},
            {icon:"expand-alt"},
            {icon:"external-link"},
            {icon:"external-link-sign"},
            {icon:"eye-close"},
            {icon:"eye-open"},
            {icon:"facetime-video"},
            {icon:"female"},
            {icon:"fighter-jet"},
          ]},
          {name:"73-84",
          children:[
            {icon:"film"},
            {icon:"filter"},
            {icon:"fire"},
            {icon:"fire-extinguisher"},
            {icon:"flag"},
            {icon:"flag-alt"},
            {icon:"flag-checkered"},
            {icon:"folder-close"},
            {icon:"folder-close-alt"},
            {icon:"folder-open"},
            {icon:"folder-open-alt"},
            {icon:"food"},
          ]},
          {name:"85-96",
          children:[
            {icon:"frown"},
            {icon:"gamepad"},
            {icon:"gift"},
            {icon:"glass"},
            {icon:"globe"},
            {icon:"group"},
            {icon:"hdd"},
            {icon:"headphones"},
            {icon:"heart"},
            {icon:"heart-empty"},
            {icon:"home"},
            {icon:"inbox"},
          ]},
          {name:"97-108",
          children:[
            {icon:"info"},
            {icon:"info-sign"},
            {icon:"key"},
            {icon:"keyboard"},
            {icon:"laptop"},
            {icon:"leaf"},
            {icon:"legal"},
            {icon:"lemon"},
            {icon:"level-down"},
            {icon:"level-up"},
            {icon:"lightbulb"},
            {icon:"location-arrow"},
          ]},
          {name:"109-120",
          children:[
            {icon:"lock"},
            {icon:"magic"},
            {icon:"magnet"},
            {icon:"mail-reply-all"},
            {icon:"male"},
            {icon:"map-marker"},
            {icon:"meh"},
            {icon:"microphone"},
            {icon:"microphone-off"},
            {icon:"minus"},
            {icon:"minus-sign"},
            {icon:"minus-sign-alt"},
          ]},
          {name:"121-132",
          children:[
            {icon:"mobile-phone"},
            {icon:"money"},
            {icon:"moon"},
            {icon:"move"},
            {icon:"music"},
            {icon:"off"},
            {icon:"ok"},
            {icon:"ok-circle"},
            {icon:"ok-sign"},
            {icon:"pencil"},
            {icon:"phone"},
            {icon:"phone-sign"},
          ]},
          {name:"133-144",
          children:[
            {icon:"picture"},
            {icon:"plane"},
            {icon:"plus"},
            {icon:"plus-sign"},
            {icon:"plus-sign-alt"},
            {icon:"print"},
            {icon:"pushpin"},
            {icon:"puzzle-piece"},
            {icon:"qrcode"},
            {icon:"question"},
            {icon:"question-sign"},
            {icon:"quote-left"},
          ]},
          {name:"145-156",
          children:[
            {icon:"quote-right"},
            {icon:"random"},
            {icon:"refresh"},
            {icon:"remove"},
            {icon:"remove-circle"},
            {icon:"remove-sign"},
            {icon:"reorder"},
            {icon:"reply"},
            {icon:"reply-all"},
            {icon:"resize-horizontal"},
            {icon:"resize-vertical"},
            {icon:"retweet"},
          ]},
          {name:"157-168",
          children:[
            {icon:"road"},
            {icon:"rocket"},
            {icon:"rss"},
            {icon:"rss-sign"},
            {icon:"screenshot"},
            {icon:"search"},
            {icon:"share"},
            {icon:"share-alt"},
            {icon:"share-sign"},
            {icon:"shield"},
            {icon:"shopping-cart"},
            {icon:"sign-blank"},
          ]},
          {name:"169-180",
          children:[
            {icon:"signal"},
            {icon:"signin"},
            {icon:"signout"},
            {icon:"sitemap"},
            {icon:"smile"},
            {icon:"sort"},
            {icon:"sort-by-alphabet"},
            {icon:"sort-by-alphabet-alt"},
            {icon:"sort-by-attributes"},
            {icon:"sort-by-attributes-alt"},
            {icon:"sort-by-order"},
            {icon:"sort-by-order-alt"},
          ]},
          {name:"181-192",
          children:[
            {icon:"sort-down"},
            {icon:"sort-up"},
            {icon:"spinner"},
            {icon:"star"},
            {icon:"star-empty"},
            {icon:"star-half"},
            {icon:"star-half-empty"},
            {icon:"subscript"},
            {icon:"suitcase"},
            {icon:"sun"},
            {icon:"superscript"},
            {icon:"tablet"},
          ]},
          {name:"193-204",
          children:[
            {icon:"tag"},
            {icon:"tags"},
            {icon:"tasks"},
            {icon:"terminal"},
            {icon:"thumbs-down"},
            {icon:"thumbs-down-alt"},
            {icon:"thumbs-up"},
            {icon:"thumbs-up-alt"},
            {icon:"ticket"},
            {icon:"time"},
            {icon:"tint"},
            {icon:"trash"},
          ]},
          {name:"205-216",
          children:[
            {icon:"trophy"},
            {icon:"truck"},
            {icon:"umbrella"},
            {icon:"unlock"},
            {icon:"unlock-alt"},
            {icon:"upload"},
            {icon:"upload-alt"},
            {icon:"user"},
            {icon:"volume-down"},
            {icon:"volume-off"},
            {icon:"volume-up"},
            {icon:"warning-sign"},
          ]},
          {name:"217-219",
          children:[
            {icon:"wrench"},
            {icon:"zoom-in"},
            {icon:"zoom-out"},
          ]},
        ]},
        {name:"Currency",
        children:[
          {icon:"btc"},
          {icon:"cny"},
          {icon:"eur"},
          {icon:"gbp"},
          {icon:"inr"},
          {icon:"jpy"},
          {icon:"krw"},
          {icon:"usd"},
        ]},
        {name:"Text Editor",
        children:[
          {name:"1-12",
          children:[
            {icon:"align-center"},
            {icon:"align-justify"},
            {icon:"align-left"},
            {icon:"align-right"},
            {icon:"bold"},
            {icon:"columns"},
            {icon:"copy"},
            {icon:"cut"},
            {icon:"eraser"},
            {icon:"file"},
            {icon:"file-alt"},
            {icon:"file-text"},
          ]},
          {name:"13-24",
          children:[
            {icon:"file-text-alt"},
            {icon:"font"},
            {icon:"indent-left"},
            {icon:"indent-right"},
            {icon:"italic"},
            {icon:"link"},
            {icon:"list"},
            {icon:"list-alt"},
            {icon:"list-ol"},
            {icon:"list-ul"},
            {icon:"paper-clip"},
            {icon:"paste"},
          ]},
          {name:"25-36",
          children:[
            {icon:"repeat"},
            {icon:"save"},
            {icon:"strikethrough"},
            {icon:"table"},
            {icon:"text-height"},
            {icon:"text-width"},
            {icon:"th"},
            {icon:"th-large"},
            {icon:"th-list"},
            {icon:"underline"},
            {icon:"undo"},
            {icon:"unlink"},
          ]},
        ]},
        {name:"Directionals",
        children:[
          {name:"1-12",
          children:[
            {icon:"angle-down"},
            {icon:"angle-left"},
            {icon:"angle-right"},
            {icon:"angle-up"},
            {icon:"arrow-down"},
            {icon:"arrow-left"},
            {icon:"arrow-right"},
            {icon:"arrow-up"},
            {icon:"caret-down"},
            {icon:"caret-left"},
            {icon:"caret-right"},
            {icon:"caret-up"},
          ]},
          {name:"13-24",
          children:[
            {icon:"chevron-down"},
            {icon:"chevron-left"},
            {icon:"chevron-right"},
            {icon:"chevron-up"},
            {icon:"chevron-down"},
            {icon:"chevron-left"},
            {icon:"chevron-right"},
            {icon:"chevron-up"},
            {icon:"circle-arrow-down"},
            {icon:"circle-arrow-left"},
            {icon:"circle-arrow-right"},
            {icon:"circle-arrow-up"},
          ]},
          {name:"25-36",
          children:[
            {icon:"double-angle-down"},
            {icon:"double-angle-left"},
            {icon:"double-angle-right"},
            {icon:"double-angle-up"},
            {icon:"hand-down"},
            {icon:"hand-left"},
            {icon:"hand-right"},
            {icon:"hand-up"},
            {icon:"long-arrow-down"},
            {icon:"long-arrow-left"},
            {icon:"long-arrow-right"},
            {icon:"long-arrow-up"},
          ]},]},
        {name:"Video Player",
        children:[
          {name:"1-8",
          children:[
            {icon:"backward"},
            {icon:"eject"},
            {icon:"fast-backward"},
            {icon:"fast-forward"},
            {icon:"forward"},
            {icon:"fullscreen"},
            {icon:"pause"},
            {icon:"play"},
          ]},
          {name:"9-16",
          children:[
            {icon:"play-circle"},
            {icon:"play-sign"},
            {icon:"resize-full"},
            {icon:"resize-small"},
            {icon:"step-backward"},
            {icon:"step-forward"},
            {icon:"stop"},
            {icon:"youtube-play"},
          ]},]},
        {name:"Brand Icons",
        children:[
          {name:"1-12",
          children:[
            {icon:"adn"},
            {icon:"android"},
            {icon:"apple"},
            {icon:"bitbucket"},
            {icon:"bitbucket-sign"},
            {icon:"btc"},
            {icon:"css3"},
            {icon:"dribbble"},
            {icon:"dropbox"},
            {icon:"facebook"},
            {icon:"facebook-sign"},
            {icon:"flickr"},
          ]},
          {name:"13-24",
          children:[
            {icon:"foursquare"},
            {icon:"github"},
            {icon:"github-alt"},
            {icon:"github-sign"},
            {icon:"gittip"},
            {icon:"google-plus"},
            {icon:"google-plus-sign"},
            {icon:"html5"},
            {icon:"instagram"},
            {icon:"linkedin"},
            {icon:"linkedin-sign"},
            {icon:"linux"},
          ]},
          {name:"25-36",
          children:[
            {icon:"maxcdn"},
            {icon:"pinterest"},
            {icon:"pinterest-sign"},
            {icon:"renren"},
            {icon:"skype"},
            {icon:"stackexchange"},
            {icon:"trello"},
            {icon:"tumblr"},
            {icon:"tumblr-sign"},
            {icon:"twitter"},
            {icon:"twitter-sign"},
            {icon:"vk"},
          ]},
          {name:"37-43",
          children:[
            {icon:"weibo"},
            {icon:"windows"},
            {icon:"xing"},
            {icon:"xing-sign"},
            {icon:"youtube"},
            {icon:"youtube-play"},
            {icon:"youtube-sign"},
          ]},]},
        {name:"Medical",
        children:[
          {icon:"ambulance"},
          {icon:"h-sign"},
          {icon:"hospital"},
          {icon:"medkit"},
          {icon:"plus-sign-alt"},
          {icon:"stethoscope"},
          {icon:"user-md"},
        ]},
      ]}
    ],
    right:[],
  },
  bodyTemplate:{
    tag:"div",
    id:"editor-workarea"
  },
  funcEvents:{
    edit: function(iEvent){
      var editorArgs = iEvent.currentTarget.dataset.editorArgs;
      console.log(editorArgs);
    },
    grid: function(iEvent){
      var editorArgs = iEvent.currentTarget.dataset.editorArgs;
      console.log(editorArgs);

    },
    icon: function(iEvent){
      var editorArgs = iEvent.currentTarget.dataset.editorArgs;
      console.log(editorArgs);

    },
  }
},{parse:true});

//populates the captchaRedData structure
(function(){
  for(var rep=0;rep<3;rep++){
    var row={
      tag:"div",
      class:"row",
      chi:[
        {tag:"div",
        class:"large-12 small-12",
        chi:[    
          {tag:"ul",
          class:"button-group even-3",
          chi:[
          ]}           
        ]}
      ]
    }
    for(var rep2=0;rep2<3;rep2++){
      row.chi[0].chi[0].chi.push(
        {tag:"li",
        chi:[
          {tag:"a",
          class:"captchaButton button small" + ((rep2 + (rep * 3))%2 ? "" : " alert"),
          id:"captchaButton" + (rep2 + (rep * 3)),
          content: ((rep2 + (rep * 3))%2 ? "blue" : " red "),
        }]
      });
    }
    templateData.captchaRedData.body.push(row);
  }
})();
