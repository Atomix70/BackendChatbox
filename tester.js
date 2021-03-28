const { Timestamp } = require("mongodb");




test=[
{
    from:"Libin",
    to:"Akhil",
    message:"Hello Akhil hw are you. This is libin",
    readstatus:"read",
},
{
    from:"Akhil",
    to:"Libin",
    message:"Hello Libin I am fine ",
    readstatus:"read",

},
{

    from:"Akshai",
    to:"Akhil",
    message:"Hello Akhil hw are you. This is akshai ",
    readstatus:"unread",
},
{

    from:"Akhil",
    to:"Akshai",
    message:"Hello Akshai hw are you ",
    readstatus:"read",
},
{
    from:"Akhil",
    to:"Akshai",
    message:"nee enthua paripadi? ",
    readstatus:"read"

},
{
    from:"Akshai",
    to:"Akhil",
    message:"inganne pokunneda ",
    readstatus:"unread"
},
{
from:"Benitto",
to:"Akhil",
message:"Hello Akhil hw are you.This is benitto ",
readstatus:"read"
},
{
    from:"Akhil",
    to:"Benitto",
    message:"Hello da hw are you.Everything fine here ",
    readstatus:"unread"
},
{
    from:"Benitto",
    to:"Akhil",
    message:"fine here too.Bye ",
    readstatus:"unread"
},

{
    from:"Akhil",
    to:"Arsha",
    message:"Hello Arsha hw are you? ",
    readstatus:"read"
},
{
    from:"Arsha",
    to:"Akhil",
    message:"Hello Akhil hw are you.This is Arsha ",
    readstatus:"read"


}
]

test2=test;
allcontacted=[]
anothersorttest=[]
k=1;
object2={

}

while(test2.length>0){
    var object={
        contact:"",
        unread:0,
        message:[]
    }
    tsort=[]
    a=test2[0]
    tsort[0]=a;
    readpending=0;
    if(a.readstatus=="unread"){
        readpending=1;
    }
    console.log("this is a",a)
    if(a.to!="Akhil"){
        i=1
        temp=a.to;
        object.contact=a.to;
        // object2.temp.messages
        allcontacted.push(a.to);
        while(i<test2.length){
            if((a.to==test2[i].from)||(a.to==test2[i].to)){
                if(test2[i].readstatus=="unread"){
                    console.log("initial",readpending)
                    readpending++
                }
                tsort.push(test2[i])
                test2.splice(i,1)
            }
            else{
                i++
            }

        }
    }
    if(a.to=="Akhil"){
        i=1
        temp=a.from
        object.contact=a.from;
        allcontacted.push(a.from)
        while(i<test2.length){
        // console.log("checking",a.to,a.from,test2[i].from,test2[i].to)

            if((a.from==test2[i].from)||(a.from==test2[i].to)){
                if(test2[i].readstatus=="unread"){
                    // console.log("initial",readpending)
                    readpending++
                }
                console.log("checker")
                tsort.push(test2[i])
                test2.splice(i,1)
            }
            else{
                i++
                console.log(i)
            }

        }
    }
    
        // console.log("tsort pass",k," ",tsort)
        test2.splice(0,1)
        // sorted[k]=tsort;
        object.message=tsort;
        object.unread=readpending;
        // object2[temp].message=tsort;
        // console.log(object)
        anothersorttest[k-1]=object;
        k=k+1;
        }
console.log((anothersorttest),allcontacted);    



