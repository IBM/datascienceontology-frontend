/* PEG.js grammar for Graphviz xdot format.

Adapted from graph-viz-d3-js:
https://github.com/mstefaniuk/graph-viz-d3-js/blob/master/src/grammar/xdot.pegjs

References:
http://www.graphviz.org/doc/info/lang.html
http://www.graphviz.org/doc/info/output.html#d:xdot
*/
{
function attributeArrayToObject(attrs) {
    var obj = {};
    attrs.forEach(function(attr) { obj[attr.key] = attr.value; });
    return obj;
}

function lengthInUtf8Bytes(str) {
    var c = str.charCodeAt(0);
    if (c < 128) {
      return 1;
    } else if (c < 2048) {
      return 2;
    } else {
      return 3;
    }
}

var counter;
var c0;
}

dot = prolog? ("strict" _)? t:("digraph" / "graph") i:(_ identifier)? _ b:body {return {type:"digraph", name: i==null ? null : i[1], statements:b}}
prolog = ("#" [^\n]* CR)+ CR
body = "{" c:statement+ "}" WS* {return c}
statement= WS* cc:(defaults / node / edge / subgraph / struct) {return cc}
defaults = t:("graph" / "node" / "edge") a:attributes ";" WS+ {return {type:t+"-attributes", attributes:a}}
struct = b:body {return {type:"subgraph", statements:b}}
graph = n:"graph" a:attributes ";" WS+ {return {type:n, attributes:a}}
subgraph = t:"subgraph" _ i:identifier _ b:body {return {type:t, name:i, statements:b}}
node = i:identifier a:attributes? ";" WS+ {return {type:"node", name:i, attributes:a}}
edge = src:identifier _ r:("->" / "--") _ tgt:identifier a:attributes? ";" WS+
    {return {type:"edge", source:src, target:tgt, attributes:a}}

attributes = _+ "[" a:attribute aa:("," WS+ aaa:attribute {return aaa})* _* "]"
    {return attributeArrayToObject(aa!=null ? [a].concat(aa) : [a]);}
attribute =
 draw
 / dimension_attr
 / point_attr
 / rect_attr
 / spline_attr
 / attribute_default

dimension_attr = t:("width" / "height") "=" d:decimal {return {key: t, value: d}}
point_attr = t:("pos" / "lp" / "size") "=" '"' p:point '"' {return {key: t, value: p}}
point = x:decimal "," y:decimal {return [x,y]}
rect_attr = t:"bb" "=" '"' r:rect '"' {return {key: t, value: r}}
rect = x1:decimal "," y1:decimal "," x2:decimal "," y2:decimal {return [x1,y1,x2,y2]}
spline_attr = t:"pos" "=" '"' e:("e," point _)? s:("s," point _)? p:point ps:(_ pss:point {return pss})* '"' {
    return {
        key: t,
        value: {
            shape: "spline",
            start: s == null ? null : s[1],
            end: e == null ? null : e[1],
            points: [p].concat(ps)
        }
    }}
attribute_default = k:identifier "=" v:nqs {return {key: k, value: v}}

draw = "_" s:("draw" / "ldraw" / "hdraw" / "tdraw" / "hldraw" / "tldraw") "_=" '"' d:drawing+ '"' {return {key: s, value: d}}
drawing = st:styling? _ sh:shapes _ {sh.style = st; return sh}
styling = s:styles ss:(_ sss:styles {return sss})*
    {return attributeArrayToObject([].concat(s).concat(ss));}
styles = pen / font / style / fontdecoration
shapes = polygon / polyline / ellipse / bspline / text

ellipse = [eE] c:coordinates _ rx:decimal _ ry:decimal {return {shape: 'ellipse', cx: c[0], cy:c[1], rx:rx, ry:ry}}
polygon = p:[pP] _ l:integer c:coordinates+ {return {shape: 'polygon', points:c}}
polyline = [L] _ integer c:coordinates+ {return {shape: 'polyline', points:c}}
bspline = [bB] _ integer c:coordinates+ {return {shape: 'bspline', points: c}}
text = [T] c:coordinates _ a:integer _ decimal _ t:vardata {
    return {
        shape: "text",
        x: c[0],
        y: c[1],
        text: t,
        anchor: a==0 ? "middle" : (a<0 ? "start" : "end")
    }}
pen = p:[Cc] _ c:vardata {return p=='C' ? {key: "fill", value: c} : {key: "stroke", value: c}}
font = f:[F] _ s:decimal _ t:vardata {return [{key:'font-family', value: "'" + t + "',serif"}, {key:'font-size', value: s}]}
fontdecoration = [t] _ v:integer {return {key:"text-decoration", value: v}}
style = [S] _ s:vardata {return {key:'style', value: s}}

vardata = s:varsize _ "-" v:varchar {return v}
varsize = s:integer {counter=s; c0=""}
varchar = &{return counter==0} / a:anysign s:varchar {return a + (s||'')}
anysign = LC? c:. {
    var c2 = "";
    if (c != "\\" || c0 == "\\") {
       counter -= lengthInUtf8Bytes(c);
       if (c0 == "\\" && c != "\\" && c != '"') {
          counter -=1;
          c2 = c0;
       }
       c2 += c;
   }
   c0 = c;
   return c2;
}

coordinates = _ p1:decimal _ p2:decimal {return [p1,p2]}
identifier = s:$CHAR+ port? {return s} / '"' s:$nq '"' port? {return s}
port = ':' identifier
integer = s:"-"? i:$[0-9]+ {return parseInt((s||'') + i)}
decimal = s:"-"? f:$[0-9]+ r:("." d:$[0-9]+ {return "." + d})? {return parseFloat((s||'') + f + (r||''))}

nqs = ('"' s:nq '"' {return s}) / $("<" ts ">") / (s:ncs {return s.trim()})
nq = $ ('\\"' / [^"])*
ts = $ ([^<>]+ / "<" [^<>]* ">")*
ncs = $ [^,\]]+

CHAR = [a-zA-Z0-9_\.\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]
CR = [\n\r]
WS = [\n\t\r ]
_ = WS LC? / LC? WS
LC = [\\] CR+
