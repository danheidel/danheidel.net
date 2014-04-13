window.templateMenu || (window.templateMenu = {});

(function(NS){
  //default menu data for all pages
  NS.defaultMenu = {
    placement:'sticky',
    width:'',
    clickable:'true',
    title:'',
    titleHref:'',
    mobileIcon:true,
    mobileName:'menu',
    mobileHref:'',
    left:[
      {icon:'home', name:'', href:'#', iconSize:'icon-2x', title:'home'},
      {name:'Software', href:'#soft-main',chi:[
        {name:'Stars', htag:'br', img:'img/stars thumbnail.png', href:'#soft-stars'}
      ]},
      {name:'Artwork', href:'#art-main', chi:[
        {name:'Rain Shower', htag:'br', img:'img/rainshow-thumb.png', href:'#art-rain'},
        {name:'Contact', htag:'br', img:'img/contact thumbnail.png', href:'#art-contact'},
        {name:'Finn Hill', htag:'br', img:'img/finnhill thumbnail.png', href:'#art-finn'},
        {name:'Inspiratories', htag:'br', img:'img/dynamicspace thumbnail.png', href:'#art-inspire'}
      ]},
      {name:'Electronics', href:'#elec-main', chi:[
        {name:'Coming soon'}
      ]},
      {name:'CV', href:'#cv'}
    ],
    right:[
      {icon:'envelope', name:'', title:'contact', chi:[
        {icon:'envelope', name:'', modal:'email-modal', iconSize:'icon-2x'},
        {icon:'github-sign', name:'', iconSize:'icon-3x', href:'https://github.com/danheidel', target:'_blank'},
        {icon:'twitter-sign', name:'', iconSize:'icon-3x', href:'https://twitter.com/dan_heidel', target:'_blank'},
        {icon:'linkedin-sign', name:'', iconSize:'icon-3x', href:'https://www.linkedin.com/profile/view?id=43637762', target:'_blank'}
      ]},
      {icon:'info', name:'', title:'about the site', chi:[
        {name:' ', href:'construction.html', modal:'construction-modal'}
      ]},
      {icon:'minus-sign-alt', name:'', id:'hideAll', on:'click', title:'show background'},
      {icon:'cog', name:'', attr:' data-reveal-id="bg-modal" ', title:'background settings'},
    ],
  };
})(window.templateMenu);
