var vid = "JKaWbVGewTg",
    streams,
    video_tag = document.getElementById("video");

fetch("https://images"+~~(Math.random()*33)+"-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D" + vid).then(response => response.text()).then(function(data) {
    if (data) {
        streams = parse_youtube_meta(data);
        video_tag.src = streams['1080p'] || streams['720p'] || streams['360p'];
    } else {
        alert('Youtube API Error');
    }
});

function parse_youtube_meta(rawdata) {
    var data = parse_str(rawdata),
            player_response = JSON.parse(data.player_response),
        streams = [],
            result = {};
    
    data.player_response = player_response;
    
    if (data.hasOwnProperty('adaptive_fmts')) {
            streams = streams.concat(data.adaptive_fmts.split(',').map(function(s) {
                return parse_str(s)
            }));
        } else {
            if (player_response.streamingData && player_response.streamingData.adaptiveFormats) {
                streams = streams.concat(player_response.streamingData.adaptiveFormats);
            }
        }
        if (data.hasOwnProperty('url_encoded_fmt_stream_map')) {
            streams = streams.concat(data.url_encoded_fmt_stream_map.split(',').map(function(s) {
                return parse_str(s)
            }));
        } else {
            if (player_response.streamingData && player_response.streamingData.formats) {
                streams = streams.concat(player_response.streamingData.formats);
            }
        }
    
    streams.forEach(function(stream, n) {
        var itag = stream.itag * 1,
            quality = false,
            itag_map = {
                18: '360p',
                22: '720p',
                37: '1080p',
                38: '3072p',
                82: '360p3d',
                83: '480p3d',
                84: '720p3d',
                85: '1080p3d',
                133: '240pna',
                134: '360pna',
                135: '480pna',
                136: '720pna',
                137: '1080pna',
                264: '1440pna',
                298: '720p60',
                299: '1080p60na',
                160: '144pna',
                139: "48kbps",
                140: "128kbps",
                141: "256kbps"
            };
        //if (stream.type.indexOf('o/mp4') > 0) console.log(stream);
        if (itag_map[itag]) result[itag_map[itag]] = stream.url;
    });
    return result;
};

function parse_str(str) {
    return str.split('&').reduce(function(params, param) {
        var paramSplit = param.split('=').map(function(value) {
            return decodeURIComponent(value.replace('+', ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
}
