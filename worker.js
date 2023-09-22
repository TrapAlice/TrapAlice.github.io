function hash(x,y){
    return (x+"-"+y).split("").reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
}

function move_up(state){
    tiles = structuredClone(state.tiles);
    score = state.score;
    merged_tiles = [];
    for (y=0; y<4; y++){
        for (x=0; x<4; x++){
            if (tiles[y][x] != 0){
                for (i=y-1; i>=0; i--){
                    if (tiles[i][x] == 0){
                        tiles[i][x] = parseInt(tiles[y][x]);
                        tiles[y][x] = 0;
                        y = i;
                    }
                    else if (tiles[i][x] == tiles[y][x]
                    && merged_tiles[hash(x,y)] == undefined
                    ){
                        tiles[i][x] += 1;
                        tiles[y][x] = 0;
                        merged_tiles[hash(x,y)] = 1;
                        y = i;
                        score += tiles[y][x];
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }
    return {score: score, tiles: tiles, ended: state.ended, direction: state.direction};
}

function move_down(state){
    tiles = structuredClone(state.tiles);
    score = state.score;
    merged_tiles = [];
    for (y=3; y>=0; y--){
        for (x=0; x<4; x++){
            if (tiles[y][x] != 0){
                for (i=y+1; i<4; i++){
                    if (tiles[i][x] == 0){
                        tiles[i][x] = parseInt(tiles[y][x]);
                        tiles[y][x] = 0;
                        y = i;
                    }
                    else if (tiles[i][x] == tiles[y][x]
                    && merged_tiles[hash(x,y)] == undefined
                    ){
                        tiles[i][x] += 1;
                        tiles[y][x] = 0;
                        merged_tiles[hash(x,y)] = 1;
                        y = i;
                        score += tiles[y][x];
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }
    return {score: score, tiles: tiles, ended: state.ended, direction: state.direction};
}

function move_left(state){
    tiles = structuredClone(state.tiles);
    score = state.score;
    merged_tiles = [];
    for (y=0; y<4; y++){
        for (x=0; x<4; x++){
            if (tiles[y][x] != 0){
                for (i=x-1; i>=0; i--){
                    if (tiles[y][i] == 0){
                        tiles[y][i] = parseInt(tiles[y][x]);
                        tiles[y][x] = 0;
                        x = i;
                    }
                    else if (tiles[y][i] == tiles[y][x]
                    && merged_tiles[hash(x,y)] == undefined
                    ){
                        tiles[y][i] += 1;
                        tiles[y][x] = 0;
                        merged_tiles[hash(x,y)] = 1;
                        x = i;
                        score += tiles[y][x];
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }
    return {score: score, tiles: tiles, ended: state.ended, direction: state.direction};
}

function move_right(state){
    tiles = structuredClone(state.tiles);
    score = state.score;
    merged_tiles = [];
    for (y=0; y<4; y++){
        for (x=3; x>=0; x--){
            if (tiles[y][x] != 0){
                for (i=x+1; i<4; i++){
                    if (tiles[y][i] == 0){
                        tiles[y][i] = parseInt(tiles[y][x]);
                        tiles[y][x] = 0;
                        x = i;
                    }
                    else if (tiles[y][i] == tiles[y][x]
                    && merged_tiles[hash(x,y)] == undefined
                    ){
                        tiles[y][i] += 1;
                        tiles[y][x] = 0;
                        merged_tiles[hash(x,y)] = 1;
                        x = i;
                        score += tiles[y][x];
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }
    return {score: score, tiles: tiles, ended: state.ended, direction: state.direction};
}

function rand(max){
    return Math.floor(Math.random() * max);
}

function place_random_two(state){
    tiles = state.tiles;
    empty_tile_count = 0;
    empty_tiles = [];
    for (y=0;y<4;y++){
        for (x=0;x<4;x++){
            if (tiles[y][x] == 0){
                empty_tiles.push([y,x]);
                empty_tile_count++;
            }
        }
    }
    if (empty_tile_count == 0){
        return {score: state.score, tiles: state.tiles, ended: true, direction: state.direction};
    }
    pos = rand(empty_tile_count);
    tiles[empty_tiles[pos][0]][empty_tiles[pos][1]] = 1;
    return {score: state.score, tiles: tiles, ended: state.ended, direction: state.direction};
}

function tick(state){
    direction = rand(4);
    new_state = null;
    switch(direction){
        case 0:
            new_state = move_up(state);
            break;
        case 1:
            new_state = move_down(state);
            break;
        case 2:
            new_state = move_left(state);
            break;
        case 3:
            new_state = move_right(state);
            break;
    }
    if (JSON.stringify(new_state.tiles) == JSON.stringify(state.tiles)){
        return state;
    }
    state = new_state;
    if (state.direction == -1){
        state.direction = direction;
    }
    state = place_random_two(state);
    return state;
}

onmessage = (e) => {
    id = e.data.id;
    state = e.data.state;
    max_turn_count = e.data.max_turn_count;
    for (turn = 0; turn < max_turn_count; turn++){
        state = tick(state);
        if (state.ended){
            self.postMessage({id: id, score: state.score, direction: -1});
        }
    }
    self.postMessage({id: id, score: state.score, direction: state.direction});
};
