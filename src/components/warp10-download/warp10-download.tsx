import {Component, Prop, State} from '@stencil/core';
import 'whatwg-fetch'

@Component({
  tag: 'warp10-download',
  styleUrl: 'warp10-download.scss',
  shadow: true
})
export class Warp10Download {

  @Prop()
  horizontal: boolean = true;

  @State()
  latest = '';
  private rex = /^<pre><[^>]+>([^<]+)\/<\/a><\/pre>$/gi;


  componentWillLoad() {
    this.httpGetAsync('https://dl.bintray.com/cityzendata/generic/io/warp10/warp10/', r => {
      console.log('httpGetAsync', r);
      let versions =[];
      r.split('\n').forEach(l => {
        if(l.match(this.rex)) {
          versions.push(this.rex.exec(l)[1]);
        }
      });
      versions.sort((a, b) => {
        if (a === b) {
          return 0;
        }
        const a_components = a.split(".");
        const b_components = b.split(".");
        const len = Math.min(a_components.length, b_components.length);
        // loop while the components are equal
        for (let i = 0; i < len; i++) {
          // A bigger than B
          if (parseInt(a_components[i]) > parseInt(b_components[i])) {
            return 1;
          }
          // B bigger than A
          if (parseInt(a_components[i]) < parseInt(b_components[i])) {
            return -1;
          }
        }
        // If one's a prefix of the other, the longer one is greater.
        if (a_components.length > b_components.length) {
          return 1;
        }
        if (a_components.length < b_components.length) {
          return -1;
        }
        // Otherwise they are the same.
        return 0;
      }).reverse();
      this.latest = versions[0];
      console.log(this.latest)
    });
  }

  httpGetAsync(theUrl, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", 'https://cors-anywhere.herokuapp.com/' + theUrl, true);
    xmlHttp.send(null);
  }

  render() {
    return (
      <div>
        { this.latest? (
        <a href={'https://dl.bintray.com/cityzendata/generic/io/warp10/warp10/'+ this.latest + '/:warp10-' + this.latest + '.tar.gz'} target="_blank">
          <img src={'assets/bintray_' + (this.horizontal ? 'horizontal' : 'vertical') + '.svg'}/>
          <img src='https://api.bintray.com/packages/cityzendata/generic/warp10/images/download.svg'/></a>
        ): (<p>loading...</p>) }
      </div>
    );
  }
}
