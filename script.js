function DroneAPI (zoom, layer, tileList){
	this.API = new DroneDeploy({version:1});
	this.zoom = zoom;
	this.layer = layer;
	this.tileList = tileList;
}

function getListItemFromLink(linkUrl){
    var last = function(array) { return array.slice(-1)[0]};
    //es6 template string
    return `<li><a href="${linkUrl}" target="_blank">${last(linkUrl.split('/'))}</a></li>`
  }

function drawTileLinksToScreen(links){
    tileList.innerHTML = links.map(getListItemFromLink).join('');
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