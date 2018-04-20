import React, { Component } from 'react';
import {generateGenome, breedMany} from './evolver.js'
import {getAngle, getMiddle, sortClockwise, getBezierPath} from './geometrics.js'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: props.height,
      num_x: props.num_x,
      num_y: props.num_y,
      box_x: props.width/props.num_x,
      box_y: props.height/props.num_y,
      temp: 0,
      genomeLength: props.genomeLength,
      genomes: [...Array(props.num_x*props.num_y)].map((x, i) =>
        generateGenome(parseInt(props.genomeLength, 10))
       ),
      selected: []
    }
    this.reset = this.reset.bind(this);
    this.select = this.select.bind(this);
    this.breed = this.breed.bind(this);

  }

  initialise() {
    this.setState({
      temp: this.state.temp + 1,
      genomes: [...Array(this.state.num_x * this.state.num_y)].map((x, i) =>
        generateGenome(parseInt(this.state.genomeLength, 10))
       ),
      selected: []
    })

  }
  select(id) {
    let selects = this.state.selected.splice(0);
    if (selects.indexOf(id) == -1) {
      selects.push(id)      
    } else {
      selects = selects.filter((x, i) => x != id)
    }
      this.setState({
        selected: selects
      })
  }

  breed(){
    if (this.state.selected.length == 0) {
      return
    }
    let parents = this.state.selected.map((x, i) =>
      this.state.genomes[x]
      )
    let new_genomes = breedMany(parents, this.state.genomes.length)
    this.setState(prevState => ({
      genomes: new_genomes,
      temp: this.state.temp + 1,
      selected: []
    }));
  }

  reset() {
    this.initialise()
  }


  render() {


    return (

      <div className="App" id={this.state.temp}>
        <svg width={this.state.width} height={this.state.height}>
          {this.state.genomes.map((x, i) =>            
            <g className={this.state.temp}>
                <BugBox 
                  i={i} 
                  genome={x} 
                  selectFunc={this.select} 
                  key={this.state.temp * 100 + i} 
                  width={this.state.box_x} 
                  height={this.state.box_y}
                  x={this.state.box_x * (i%this.state.num_x)}
                  y={this.state.box_y * parseInt(i/this.state.num_x,10)}
                  />
                </g>
        )}
        </svg>
        <p> .</p>
        <button onClick={this.reset}>Click to Reset</button>
        <button onClick={this.breed}>Click to Breed</button>
      </div>
    )
  }
}

class BugBox extends Component {
  constructor(props){
    super(props);
    this.selectFunc = props.selectFunc;
    this.pattern = Flower;
    this.state = {
      key: props.i,
      i: props.i,
      selected: false,
      width: props.width,
      height: props.height,
      x: props.x,
      y: props.y,
      genome: props.genome,
    }

    this.select = this.select.bind(this);
    this.update = this.update.bind(this);
  }

  update(genome) {
      this.setState({
      selected: false,
      genome: genome,
    })

  } 


  select() {
    this.setState({selected: !this.state.selected});
    this.selectFunc(this.state.i)
  }

  render() {
    let offset_x = this.state.x 
    let offset_y = this.state.y
    return ( 
      <g>
      <rect x={this.state.x} y={this.state.y } width={this.state.width} height={this.state.height} fill="none" stroke="#666666" opacity="0.4"s/>
        <this.pattern genome={this.state.genome} width={this.state.width} height={this.state.height} offset_x={offset_x} offset_y={offset_y} selected={false}/>
        <rect x={this.state.x} y={this.state.y } width={this.state.width} height={this.state.height} opacity={this.state.selected? 0.2 : 0} stroke="black" onClick={this.select}/>
      </g>
      )
  }
}

class Circle extends Component {
  constructor(props){
    super(props);
    this.state = {
      genome: props.genome,
      width: props.width,
      height: props.height,
      offset_x: props.offset_x,
      offset_y: props.offset_y,
    }
  }
  render(){
    return (
        <circle 
          cx={this.state.width/2 + this.state.offset_x} 
          cy={this.state.height/2 + this.state.offset_y} 
          r={ (4 + parseInt(this.state.genome[8],16) * 2) * (this.state.width/100)} 
          stroke={'none'}
          fill={"#" + this.state.genome.substr(0,6)}
          />
    )
  }
}

class Polygon extends Component {
  constructor(props){
    super(props);
    this.state = {
      genome: props.genome,
      width: props.width,
      height: props.height,
      offset_x: props.offset_x,
      offset_y: props.offset_y,
      mult: props.width/200
    }
  }

  getPoints(){
    return [...Array(parseInt(this.state.genome.length/4, 10))].map((x,i)=>
        [
          this.state.offset_x + (this.state.mult * parseInt( this.state.genome.substr(i*4, 2), 16)), 
          this.state.offset_y + (this.state.mult * parseInt( this.state.genome.substr(2 + i * 4, 2), 16))
        ]
      )
  }

  getSortedVertices(){
    let points = this.getPoints();

    let sorted_points = sortClockwise(points)

  return sorted_points




  }

  render(){
    let points = this.getSortedVertices()
    let path = getBezierPath(points);
    return (
        <path
          d={path}
          stroke={'black'}
          // fill={"#" + this.state.genome.substr(0,6)}
          />
    )
  }
}

class Multigon extends Component {
  constructor(props){
    super(props);
    this.state = {
      genome: props.genome,
      width: props.width,
      height: props.height,
      offset_x: props.offset_x,
      offset_y: props.offset_y,
      mult: props.width/256
    }
  }

  getPoints(start, length){
    return [...Array(parseInt(length/4, 10))].map((x,i)=>
        [
          this.state.offset_x + (this.state.mult * parseInt( this.state.genome.substr(start + i*4, 2), 16)), 
          this.state.offset_y + (this.state.mult * parseInt( this.state.genome.substr(start + 2 + i * 4, 2), 16))
        ]
      )
  }

  getSortedVertices(start, length ){
    let points = this.getPoints(start, length);

    let sorted_points = sortClockwise(points)

  return sorted_points

  }

  decypher(){
    let genome = this.state.genome;
    let num_of_shapes = parseInt(parseInt(genome[0],16) /2, 10);
    let lengths_of_shapes = [...Array(num_of_shapes)].map((x,i)=>
      parseInt(3 + parseInt(genome[ i + 1], 16),10) * 4
    )
    console.log("lengsth")
    console.log(lengths_of_shapes)
    let starts_of_shapes = [...Array(num_of_shapes)].map((x,i)=>
      parseInt(genome.substr(num_of_shapes + 1 + 2 * i, 2), 16)
    )
    genome += genome
    return [...Array(num_of_shapes)].map((x,i)=>
      [starts_of_shapes[i], lengths_of_shapes[i]]
    ).filter((x,i)=>
      x[0] + x[1] + 6 < this.state.genome.length
    )
  }


  render(){
    let paths = []
    let shapes = this.decypher();
    let transformation = "scale(-1, 1) "
    transformation += "translate(" + ((-2 * this.state.offset_x) - this.state.width ) + ",0)"

    shapes.forEach((x,i)=>
      paths.push(
        <g>
          <path 
            d={getBezierPath(this.getSortedVertices(x[0] + 6, x[1]))} 
            fill={'#' + this.state.genome.substr(x[0],6)} 
            opacity={parseInt(this.state.genome[x[0]+7],16)/16}/>
          <path 
            d={getBezierPath(this.getSortedVertices(x[0] + 6, x[1]))} 
            fill={'#' + this.state.genome.substr(x[0],6)} 
            opacity={parseInt(this.state.genome[x[0]+7],16)/16}
            transform={transformation}/>
          </g>

          )
      )

    return (
      <g>
        {paths}
      </g>
    )
  }
}

class Flower extends Component {
  constructor(props){
    super(props);
    this.state = {
      genome: props.genome,
      width: props.width,
      height: props.height,
      offset_x: props.offset_x ,
      offset_y: props.offset_y ,
      mult: props.width/378
    }
    this.getSortedVertices = this.getSortedVertices.bind(this);

  }

  getPoints(start, length){
    return [...Array(parseInt(length/4, 10))].map((x,i)=>
        [
          this.state.offset_x + (this.state.mult * parseInt( this.state.genome.substr(start + i*4, 2), 16)), 
          this.state.offset_y + (this.state.mult * parseInt( this.state.genome.substr(start + 2 + i * 4, 2), 16))
        ]
      )
  }

  getSortedVertices(start, length ){
    let points = this.getPoints(start, length);

    let sorted_points = sortClockwise(points)

  return sorted_points

  }

  decypher(){
    let genome = this.state.genome;
    let num_of_shapes = parseInt(parseInt(genome[0],16) /2, 10);
    let lengths_of_shapes = [...Array(num_of_shapes)].map((x,i)=>
      parseInt(3 + parseInt(genome[ i + 1], 16),10) * 4
    )
    let starts_of_shapes = [...Array(num_of_shapes)].map((x,i)=>
      parseInt(genome.substr(num_of_shapes + 1 + 2 * i, 2), 16)
    )
    let repeats_of_shapes = [...Array(num_of_shapes)].map((x,i)=>
      parseInt(3 + parseInt(genome[i +32 ], 16) / 2, 10)
    )
    console.log(repeats_of_shapes)
    genome += genome
    return [...Array(num_of_shapes)].map((x,i)=>
      [starts_of_shapes[i], lengths_of_shapes[i], repeats_of_shapes[i]]
    ).filter((x,i)=>
      x[0] + x[1] + 6 < this.state.genome.length
    )
  }


  render(){
    let paths = []
    let shapes = this.decypher();
    let _this = this;

    shapes.forEach(function (x,i){
      let repeats = [];
      let shapePath = getBezierPath(_this.getSortedVertices(x[0] + 6, x[1]))
      let color = '#' + _this.state.genome.substr(x[0],6)
      let opacity = 1/(1 + parseInt(_this.state.genome[x[0]+13], 16))
      let degrees = 360/x[2];
      console.log('degrees:');
      console.log(degrees);
      [...Array(x[2])].forEach((rotation, ii)=>
        repeats.push(<path
            d={shapePath}
            fill={color}
            stroke="#666666"
            strokeWidth="2"
            strokeOpacity={opacity *2}
            opacity={opacity}
            transform={"rotate("+(ii * degrees) + "," + (_this.state.offset_x + _this.state.width/2) + "," + (_this.state.offset_y + _this.state.height/2)+")"}
          />
        )
      )
      paths.push(repeats)
      })

    return (
      <g>
        {paths}
      </g>
    )
  }
}



export default App;


