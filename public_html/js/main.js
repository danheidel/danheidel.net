window.templateData || (window.templateData = {});

(function(NS){  
NS.mainData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[
    {tag:'div',
    class:'row',
    chi:[
      {panel: ' ',
      colClass: 'large-8',                  
      chi:[
        {tag:'h3',c: 'Hey, I\'m Dan, this is my stuff!'},
        {tag:'p',content: 'Hey there! C\'mon in, poke around.'},
        {htag:'br'},
        {tag:'p', c:'Over the last several years, I\'ve done and made some cool stuff.  It has occurred to me that people might, at some point be interested in seeing some of that stuff.'},
      ]},
      {panel: ' ',
      colClass:'large-4',
      chi:[
        {tag:'h4',c:'Who the hell is Dan?'},
        {tag:'p',c:'Dan is a nominally sentient, endothermic carbon-based life form residing in the monkey hive known as Seattle.'},
        {tag:'br'}
      ]},
    ]},
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-8',
      chi:[
        {tag:'p',
        c:' ',
      }]},
      {panel:' ',
      colClass:'large-4',
      chi:[
        {tag:'p', c:'The hats he has worn include:'},
        {htag:'hr'},
        {tag:'p', c:'Molecular biologist'},
        {tag:'p', c:'Nanotech researcher'},
        {tag:'p', c:'Food safety microbiologist'},
        {tag:'p', c:'C# programmer'},
        {tag:'p', c:'Project manager'},
        {tag:'p', c:'Electronics design engineer'},
        {tag:'p', c:'Installation artwork designer'},
        {htag:'br'},
        {tag:'p', c:'He is currently moving into the world of Javascript application development.  This website is probably a decent guide to whether this has been successful at all.'},
        {htag:'br'},
        {tag:'p', chi:[
          {tag:'span', c:'He has also completed '},
          {tag:'span', id:'age-timer', c:((Date.now() - 203756400000)/86400000/365.25).toFixed(5)},
          {tag:'span', c:' successful circumnavigations of the sun.'}
        ]},
        {htag:'br'},
        {tag:'p', c:'He does not usually refer to himself in the third person and is not sure why he is doing it now.'}
      ]},
    ]},
  ]
},{parse:true});  //mainData

NS.softwareData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[{
    tag:'div'
  }]
},{parse:true});

NS.artData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-4 push-8',
      chi:[
        {tag:'p', c:'Over the last few years, I have worked on a number of different artwork installation pieces in collaboration with Seattle artist Susie J. Lee.'},
        {tag:'p', c:'In most cases, I was responsible for the electronics and lighting components of the artwork.  However, in some cases, I also did the complete physical design and construction of the piece.'}
      ]},
      {panel:' ',
      colClass: 'large-8 pull-4',
      chi:[
        {tag:'h3', c:'Installation art pieces'},
        {tag:'ul',
        class:'large-block-grid-2 small-block-grid-1',
        chi:[
          {tag:'li',
          chi:[
            {tag:'a', href: '#art-rain', 
              chi:[{tag:'img', src:'img/rainshow med thumb.png'}],
            }
          ]},
          {tag:'li',
          chi:[
            {tag:'a', href: '#art-contact', 
              chi:[{tag:'img', src:'img/contact med thumbnail.png'}],
            }
          ]},
          {tag:'li',
          chi:[
            {tag:'a', href: '#art-inspire', 
              chi:[{tag:'img', src:'img/dynamicspace med thumbnail.png'}],
            }
          ]},
          {tag:'li',
          chi:[
            {tag:'a', href: '#art-finn', 
              chi:[{tag:'img', src:'img/finnhill med thumbnail.png'}],
            }
          ]}
        ]}
      ]}
    ]}
  ]
},{parse:true}); //artData

NS.rainData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-4 push-8',
      chi:[
        {tag:'p', c:'Rain Shower was a major installation piece in the Frye Art Museum as part of the 60th anniversary gala.'},
        {tag:'p', caption:'Rain Shower uses light to evoke rain and sound to explore the nature of human memory.'},
      ]},
      {panel:' ',
      colClass:'large-8 pull-4',
      chi:[
        {tag:'h3', c:'Rain Shower 2012'},
        {tag:'ul',
        attr:' data-orbit',
        chi:[
          {tag:'li',chi:[
            {tag:'img', src:'img/rainshower3.jpg', width:'691', height:'492'},
            {tag:'div', class:'orbit-caption', content: 'Photo credit: Erik Skaar'},
          ]},
          {tag:'li',chi:[
            {tag:'img', src:'img/rainshower1.jpg'},
            {tag:'div', class:'orbit-caption', content: 'Photo credit: Erik Skaar'},
          ]},
          {tag:'li',chi:[
            {tag:'img', src:'img/rainshower2.jpg'},
            {tag:'div', class:'orbit-caption', content: 'Photo credit: Erik Skaar'},
          ]},
        ]},
        {tag:'p', c:'Frye Art Museum, Susie Lee'},
        {htag:'br'},
        {tag:'p', c:'Another collaboration with Susie Lee, this piece is loosely based of an earlier, smaller work of hers.'},
        {htag:'br'},
        {tag:'p', c:'Rain Shower evokes the feeling of rain by simulating raindrops by projecting modulated white light pulses onto a darkened floor.  Found sounds are projected from a distributed speakder network to further evoke the sensation of rainfall.  The rainfall ebbs and flows with recorded music and interviews to engage the viewer in an examination of our relationship with our memory of the past.'},
        {htag:'br'},
        {tag:'p', c:'This piece was over 1500 sq ft of ceiling mounted steel framework with 512 high intensity LEDs.  The system was controlled by a Processing node on a PC communicating with a network of 32 custom designed Arduino clones on an RS485 differential network.  The LEDs were each individually controlled by TLC5940 ICs at each node.  32 individual speakers play directional sound in coodination with wall-mount speakers playing music and interview sound clips.  The system has full digital control over light timing, intensity, and sound.'},
        {htag:'br'},
        {tag:'p', c:'For this piece, I was responsible for electronics design, fabrication, metalworking, assembly and programming.'},
      ]},
    ]},
  ]
},{parse:true}); //rainData

NS.contactData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-4 push-8',
      chi:[
        {tag:'p', c:'Contact is an interactive digital art piece that combines digital communicativity with an analog electronics asthetic.'},
        {tag:'p', caption:'It explores the nature of contact and human communication in a world of continuous and overwhelming connectivity.'},
      ]},
      {panel:' ',
      colClass:'large-8 pull-4',
      chi:[
        {tag:'h3', c:'Contact 2012'},
        {tag:'ul',
        attr:' data-orbit',
        chi:[
          {tag:'li',chi:[
            {tag:'img', src:'img/contact part3_lbox.jpg'},
            {tag:'div', class:'orbit-caption', content: 'Photo credit: Erik Skaar'},
          ]},
          {tag:'li',chi:[
            {tag:'iframe',
            src:'http:\/\/player.vimeo.com/video/25887447?byline=0&amp;portrait=0&amp;color=888888',
            width:700,
            height:420,
            attr: ' frameborder=\'0\' webkitAllowFullScreen mozallowfullscreen allowFullScreen>'},
          ]},
          {tag:'li',chi:[
            {tag:'img', src:'img/contact part4_lbox.jpg', height:'556', width:'400'},
            {tag:'div', class:'orbit-caption', content: 'Photo credit: Erik Skaar'},
          ]},
          {tag:'li',chi:[
            {tag:'img', src:'img/contact part5_lbox.jpg'},
            {tag:'div', class:'orbit-caption', content: 'Photo credit: Erik Skaar'},
          ]},
          {tag:'li',chi:[
            {tag:'img', src:'img/contact part6_lbox.jpg'},
            {tag:'div', class:'orbit-caption', content: 'Photo credit: Erik Skaar'},
          ]},
        ]},
        {tag:'p', c:'Frye Art Museum, Susie Lee'},
        {htag:'br'},
        {tag:'p', c:'Contact examines the relationship between technology, communication and ourselves in an era of sensory overstimulation.  Constructed from vintage scientific equipment and historic engineering materials, it evokes the aesthetic of vacuum-tube era computing.  However, it is an advanced digital piece capable of email, phone and SMS connectivity.'},
        {htag:'br'},
        {tag:'p', c:'When contacted, the piece plays out the body of the missive in Morse code using a relay and electrically heats a piece of graphite to incandescence to signify the condensation of the entire communication to a single binary bit.  It then proceeds to randomly communicate back to the viewer over time, becoming increasingly irate if the viewer does not promptly communicate back to it.'},
        {htag:'br'},
        {tag:'p', c:'Contact is an antique scientific instrumentation case with a CNC milled copper facing.  A Nokia cellphone is used to receive phone calls, texts and emails.  A bluetooth link is established to a Mac Mini which is interfaced to an Arduino with a custom manufactured MOSFET array which handles the large amperage loads for the carbon leads.  The individual elements are mechanical pencil leads held in modified hair clips and encased in borosillicate tubing.  Each element heats up to approximately 3000 F when activated.'},
        {htag:'br'},
        {tag:'p', c:'For this piece, I was responsible for all physical fabrication, all custom electronics and wiring and all programming downstream of the bluetooth interface.'},
      ]},
    ]},
  ]
},{parse:true}); //contactData

NS.inspireData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-4 push-8',
      chi:[
        {tag:'p', c:'Inspiratories is a glass art piece showcased at the Dynamikspace design studio.  Invoking natural color schemes, the blades of glass cycle through color cycles meant to evoke the passage of seasons.'},
      ]},
      {panel:' ',
      colClass:'large-8 pull-4',
      chi:[
        {tag:'h3', c:'Inspiratories 2012'},
        {tag:'ul',
        attr:' data-orbit',
        chi:[
          {tag:'li',chi:[
            {tag:'img', src:'img/dynamicspace2.jpg'},
            {tag:'div', class:'orbit-caption', content: 'Photo credit: Rodrigo Valenzuela'},
          ]},
        ]},
        {htag:'br'},
        {tag:'p', c:'This is a collaborative piece with Susie Lee and Scott \'Chico\' Rasky.'},
        {htag:'br'},
        {tag:'p', c:'Each blade is individually lit and digitally controlled by a series of microcontroller nodes which communicate via networked serial to create rich, fading palates of color.'},
        {tag:'p', c:'For this piece, I was responsible for all electronics, lighting and programming.'},
      ]},
    ]},
  ]
},{parse:true}); //dynamikData

NS.finnData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-4 push-8',
      chi:[
        {tag:'p', c:'Finn Hill Family is a large, interactive piece installed at Finn Hill Junior High School.  It interacts with the LEED building automation electronics to communicate the amount of building resource usage to students.'},
      ]},
      {panel:' ',
      colClass:'large-8 pull-4',
      chi:[
        {tag:'h3', c:'Finn Hill Junior High 2011'},
        {tag:'ul',
        attr:' data-orbit',
        chi:[
          {tag:'li',chi:[
            {tag:'img', src:'img/finnhill sculpture1 sm.jpg'},
          ]},
          {tag:'li',chi:[
            {tag:'img', src:'img/finnhill sculpture4 sm.jpg'},
          ]},
        ]},
        {htag:'br'},
        {tag:'p', c:'A collaboration with Susie Lee and Scott \'Chico\' Rasky, this installation is an environental awareness piece.  It changes lighting intensity and color over time to represent the level of resource usage such as water, electricity and heating being used in the school.  Pulling data from the building automation controllers, it can query this data in real time.'},
        {htag:'br'},
        {tag:'p', c:'Each piece is cast recycled glass illuminated by a high intensity RGB LED array.  The array is powered and controlled by a custom PCB controller board and receiving information via ethernet from the building automation computers.'},
        {htag:'br'},
        {tag:'p', c:'For this piece, I was responsible for all lighting and electronics as well as portions of the glass fabrication and installation.'},
      ]},
    ]},
  ]
},{parse:true}); //finnData

NS.electronicsData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-4 push-8',
      chi:[
      ]},
      {panel:' ',
      colClass:'large-8 pull-4',
      chi:[
        {tag:'h3', c:'My electronics work'},
      ]},
    ]},
  ]
},{parse:true}); //electronicsData

NS.cvData = new window.templateFunctions.BuildPage({
  menuTemplate:window.templateMenu.defaultMenu,
  bodyTemplate:[
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-12',
      chi:[{tag:'h2', c:'Dan Heidel'}
      ]},
    ]},
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-8',
      chi:[
        {tag:'h4', c:'Summary'},
        {tag:'p', c:'I have a wide ranging set of job experience that include C/C++/C# .Net application development, embedded electronics programming in C, electronics design, PCB design, project management and a wide variety of scientific disciplines.'},
        {tag:'p', content:''}
      ]},
      {panel:' ',
      colClass: 'large-4',
      chi:[
        {tag:'h4', c:'Programming Skills'},
        {tag:'hr'},
        {tag:'ul',
        class:'no-bullet',
        chi:[
          {tag:'h5', c:'Javascript'},
          {tag:'ul',
          chi:[
            {tag:'p', c:'jQuery'},
            {tag:'p', c:'Backbone'},
            {tag:'p', c:'Handlebars'},
            {tag:'p', c:'HTML5'},
            {tag:'p', c:'Canvas'},
          ]}, 
          {tag:'h5', c:'C#'},
          {tag:'h5', c:'C/C++'},
          {tag:'h5', c:'SQL'},
          {tag:'h5', c:'Assembly'},
          {tag:'ul',
          chi:[
            {tag:'p', c:'Atmel atMega'},
            {tag:'p', c:'Microchip dsPic33'},
            {tag:'p', c:'ARM Cortex M'},
          ]}, 
        ]}, //ul
        {tag:'h4', c:'Related Skills'},
        {tag:'hr'},
        {tag:'ul',
        chi:[
          {tag:'h5', c:'Project Management'},
          {tag:'h5', c:'PCB design'},
          {tag:'h5', c:'System design and integration'},
          {tag:'h5', c:'Fabrication and Metalworking'},
          {tag:'h5', c:'Supply chain design and management'},
        ]}, //ul
      ]}
    ]},
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'large-8',
      chi:[
        {tag:'h4', c:'Experience'},
        {tag:'h5', c:'Independent contractor'},
        {tag:'blockq', c:'2009-2013'},
        {tag:'p', c:'I have been doing independent computer programming and electrical engineering design for the past 3 years.  My electrical engineering work has been primarily geared towards art installation pieces in collaboration with local artists.  I have been responsible for the physical and electrical design of several local art pieces including a flagship piece featured at the Frye Art Museum 60th anniversary celebration.  I have also been working on developing my own line of wirelessly networked LED stage lighting and garden automation systems.'},
      ]},
      {panel:' ',
      colClass: 'large-4',
      chi:[
        {tag:'h4', c:'Education'},
        {tag:'hr'},
        {tag:'ul',
        class:'no-bullet',
        chi:[
          {tag:'h5', c:'BS Molecular and Cellular Biology'},
          {tag:'p', c:'University of Washington - 1998'},
          {htag:'br'},
          {tag:'h5', c:'PhD Materials Science and Engineering'},
          {tag:'p', c:'University of Washington - incomplete'},
          {htag:'br'},
          {tag:'h5', c:'MS Electrical Engineering'},
          {tag:'p', c:'University of Washington - ongoing'},
        ]},
      ]}
    ]},
  ]
},{parse:true}); //cvData

NS.captchaRedData = {
  body: [
    {tag:'div',
    class:'row',
    chi:[
      {panel:' ',
      colClass:'center-4',
      chi:[
        {tag:'a', class:'close-reveal-modal', c:'X'},
        {tag:'h3', c:'CAPTCHA TIME'},
        {tag:'p', c:'Make all the buttons red to prove you aren\'t a spambot!'}
      ]},
    ]},
  ],
};

NS.captchaVerifiedContent = {
  body: [
    {tag:'div',
    class:'row',
    chi:[
      {tag:'a', class:'close-reveal-modal', c:'X'},
      {tag:'h3', c:'Congratulations!'},
      {tag:'p', c:'You are human or a very good spambot!'},
      {tag:'p', c:'Either way, here\'s my email address:'},
      {tag:'p', c:'dan.heidel@gmail.com'},
      {tag:'a', href:'mailto:dan.heidel@gmail.com', c:'Or click here!'}
    ]
  }],
};

//populates the captchaRedData structure
(function(){
  for(var rep=0;rep<3;rep++){
    var row={
      tag:'div',
      class:'row',
      chi:[
        {tag:'div',
        class:'large-12 small-12',
        chi:[    
          {tag:'ul',
          class:'button-group even-3',
          chi:[
          ]}           
        ]}
      ]
    }
    for(var rep2=0;rep2<3;rep2++){
      row.chi[0].chi[0].chi.push(
        {tag:'li',
        chi:[
          {tag:'a',
          class:'captchaButton button small' + ((rep2 + (rep * 3))%2 ? '' : ' alert'),
          id:'captchaButton' + (rep2 + (rep * 3)),
          content: ((rep2 + (rep * 3))%2 ? 'blue' : ' red '),
        }]
      });
    }
    NS.captchaRedData.body.push(row);
  }
})();
})(window.templateData);
