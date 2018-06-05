  function xml2Object(xml){
      var parser = new $.util.SAXParser();
      var result = {};
      var lastName = '';
      var lastSetting = null;
      var lastElement = null;
      
      var settings = {};
      settings.root = { consider: false, parent: null, type: 'property' };
      settings.UserId = { consider: true, parent: null, type: 'property' };
      settings.supplier = { consider: true, parent: null, type: 'property' };
      settings.Company = { consider: true, parent: null, type: 'property' };
      settings.filter = { consider: true, parent: null, type: 'object' };
      settings.CODE1 = { consider: true, parent: 'filter', type: 'property' };
      settings.GROUP = { consider: true, parent: 'filter', type: 'array' };
      settings.MGR = { consider: true, parent: 'filter', type: 'array' };
      settings.mpn = { consider: true, parent: null, type: 'array' };
      parser.startElementHandler = function(name, attrs){
        lastName = name;
        
        lastSetting = settings[lastName];
          
        if(!lastSetting || lastSetting.consider === false){
            return;
        }    
        
        var parentStructure = [];
        var tmpSetting = lastSetting;
        while(tmpSetting.parent !== null){
            parentStructure.push(tmpSetting.parent);
            tmpSetting = settings[tmpSetting.parent];
        }
        
        lastElement = result;
        
        while(parentStructure.length > 0){
            var child = parentStructure.pop();
            lastElement = lastElement[child];
        }
        
        switch(lastSetting.type){
            case 'property':
                lastElement[lastName] = null;
                break;
            case 'object':
                lastElement[lastName] = {};
                break;
            case 'array':
                if(!lastElement[lastName]){
                  lastElement[lastName] = [];
                }
                break;
        }
        
      };
      
      parser.characterDataHandler = function(value){  
         switch(lastSetting.type){
             case 'property':
                 lastElement[lastName] = value;
                 break;
             case 'array':
                 lastElement[lastName].push(value);
        }
      };
      parser.parse(xml);
      
      return result;
    }
    var xmlInput = '<root>' +
                      '<UserId>USER1</UserId>' +
                      '<supplier>123</supplier>' +
                      '<Company>ABC</Company>' +
                      '<filter>' +
                         '<CODE1/>' +
                         '<GROUP/>' +
                         '<MGR>test</MGR>' +
                         '<MGR>abc</MGR>' +
                      '</filter>' +
                      '<mpn/>' +
                   '</root>';
                   
    var res = xml2Object(xmlInput);
    $.response.contentType="application/json";
    $.response.setBody(JSON.stringify(res));
