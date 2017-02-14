self.addEventListener('message',function(ev){
    var obj = {
        beenget: 0,
        h_m: ev.data[0],
        sbmsgid: "0",
        smax_msgid: "0",
        token: ev.data[1]
    }
    getMsgList(obj, ev.data[0]);
})


function getMsgList(obj, h_m){
    var request = new XMLHttpRequest();
    request.open('POST', 'test.json', true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var msgs = data.data.ent.msgs;
            var users = data.data.ext.users;
            for(var i=0; i<msgs.length; i++){
                var ele = msgs[i];
                if((ele.ctype == 1) && (ele.mtype == 1 || ele.mtype == 2 || ele.mtype == 3)){
                    var uid = ele.uid != h_m ? ele.uid : ele.touid;
                    var userInfo = getUserMsg(uid, users);
                    var obj = extend({}, ele, userInfo);
                    self.postMessage(JSON.stringify(obj));
                }else 
                if((ele.ctype == 2||ele.ctype == 11) && (ele.mtype == 1 || ele.mtype == 2 || ele.mtype == 3)){
                    var guid = ele.sdialogid;
                    var sobj = { sdialogid: guid };
                    var request1 = new XMLHttpRequest();
                    request1.open('POST', 'getinfo.json', true);
                    request1.onload = function() {
                      if (request1.status >= 200 && request1.status < 400) {
                        var data = JSON.parse(request1.responseText);
                        var gdata = data.data;
                        var ginfo = gdata.info;
                        var gobj = extend({}, ele, ginfo, {dialogid: gdata.dialogid});
                        self.postMessage(JSON.stringify(gobj));
                      } else {}
                    };
                    request1.send(JSON.stringify(sobj));
                }
            }
//            if (data.data.ent.more) {
//                var g_obj={
//                    token: "85fb70418b53730020dd30714c866fb3",
//                    sbmsgid: data.data.ent.sbmsgid,
//                    beenget: msgs.length,
//                    h_m: 107105,
//                    smax_msgid:'0'
//                }
//                getMsgList(g_obj)
//            } 
        } else {}
    };
    request.send(JSON.stringify(obj));
}

function getUserMsg(id, users) {
    var avatar = '';
    for (var i = 0; i < users.length; i++) {
        if (id == users[i].id) {
            avatar = users[i];
            break
        }
    }
    return avatar;
}

var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }
  return out;
};

