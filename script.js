function DroneAPI (zoom, layer){
	this.API = new DroneDeploy({version:1});
	this.zoom = zoom;
	this.layer = layer;
}

var canvas = document.getElementById('joined');

function getListItem(linkURL) {
	return linkURL;
}

function drawTileLinksToScreen(links){
	//TODO: This function is using for split and load data from website
	//After that, it will merge data by vertical way first by a group of message
	//Finally, merge these groups together.
	var countingGroup = 2;
    var numberOfGroup = 0;
    var indexGroup = 0;
    var groupImage = [];
    var listFinalImage = [];
    var offset_x=0;

    for (index=0;index<countingGroup;index++){
        var groupCanvas = document.createElement('canvas');
        groupCanvas.setAttribute("id", index);
        document.body.appendChild(groupCanvas);
        listFinalImage.push(groupCanvas);
    }

    for (index1=0;index1<imagesSRC.length;index1++) {
        groupImage.push(imagesSRC[index1]);
        if (indexGroup==countingGroup-1) {
            var currentCanvas = listFinalImage[numberOfGroup];
            photojoinerVertical.join({'images':groupImage, 'canvas':currentCanvas});
            indexGroup=0;
            numberOfGroup++;
        } else {
            indexGroup++;     
        }
    }
}

function fetchTileDataFromPlan(api, plan, droneAPI){
	return api.Tiles.get({planId: plan.id, layerName: droneAPI.layer.value, zoom: parseInt(droneAPI.zoom.value)});
}

function getTilesFromResponse(tileResponse){
	return tileResponse.tiles;
}

function updateTileLinks(droneAPI){
	droneAPI.API.then(function(dronedeployApi){
		return dronedeployApi.Plans.getCurrentlyViewed().then(function(plan){
			return fetchTileDataFromPlan(dronedeployApi, plan, droneAPI);
		});
	})
	.then(getTilesFromResponse)
	.then(drawTileLinksToScreen);
}


function FindingListOfImage(listOfURL) {
	var countingImage = 0;
	var listOfImageName = [];
	var last = function(array) { return array.slice(-1)[0]};

	for (index=0;index<listOfURL.length;index++){
		var lastName = last(listOfURL[index].split('/')).split('?')[0]
		var foundImage = $.inArray(lastName, listOfImageName) > -1;
		if (foundImage == false) {
			countingImage++;
			listOfImageName.push(lastName);
		} else {
			break;
		}
	}
	return countingImage;
}

var photojoinerVertical = (function(){
    var drawData = [];
    var image;
    var canvas_width = 0;
    var canvas_height = 0;
    var offset_x = 0;
    var module = {};  
    
        module.join = function( config ){
            config = config || {};
            images = config.images || [];
            canvasHeight = config.canvasHeight || 350;
            canvas = config.canvas || document.getElementById('joined');
            canvas.height = canvasHeight;
            context = canvas.getContext('2d');
            if( images.length > 0 )  
            {
                image = new Image();
                image.src = images[0];
                //Wait for image load
                image.onload = function(){
                        images.shift();
                        ratio = image.naturalHeight/canvasHeight;
                        image_width = this.width/ratio;
                        image_height = this.height/ratio;    
                        drawData.push({
                            'image': this,
                            'ratio': ratio,
                            'scaledWidth' : image_width,
                            'scaledHeight' : image_height
                        });
                        canvas_width += image_width;
                        canvas_height += image_height;
                        module.join( config );
                    };
            }else{
                canvas.width = canvas_width;
                canvas.height = canvas_height;
                for( var i=0; i<drawData.length; i++ )
                {
                	console.log(offset_x);
                    current = drawData[i];
                    context.drawImage(current.image, 0, 0, current.image.width, current.image.height, 0, offset_x, current.scaledWidth, current.scaledHeight); 
                    offset_x += current.scaledHeight;
                }
            }  
        };
    return module;
})();