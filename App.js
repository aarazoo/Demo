import React from 'react';
import './App.css';
import {Container, Form, Row, Col, Modal, Button,Table} from 'react-bootstrap';
import { StyledDropZone } from 'react-drop-zone';
import 'react-drop-zone/dist/styles.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      files: [],
      imageArray:[],
      src:null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 1 / 1,
    },
    modal:false,
    val:false,
    saveImage:false,
    croppedImageUrl:null,
    name:"",
    age:"",
    selectedOption:""
    }
    
  }
  handleChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
        selectedOption:e.target.value
    })
  }
  
  dataSubmit=(e)=>{
    e.preventDefault();
    if(this.state.name==="" || this.state.age==="" || this.state.croppedImageUrl==="" || this.state.selectedOption===""){
      alert("please fill the feild.")
    }else{
    let {imageArray} = this.state;
    let obj={
      id:this.state.imageArray.length + 1,
      name:this.state.name,
      age:this.state.age,
      gender:this.state.selectedOption,
      image:this.state.croppedImageUrl
    }
    imageArray.push(obj)

    this.setState({
      files: [],
      src:null,
      crop: {
        unit: '%',
        width: 30,
        aspect: 1/1,
      },
      modal:true,
      saveImage:false,
      val:false,
      croppedImageUrl:null,
      name:"",
      age:"",
      selectedOption:"",
      imageArray
    })
  }
  }
  
  addFile = (file, text) => {
    this.setState({ files: [...this.state.files, file],modal:true })

    if (this.state.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener('load', () =>
            this.setState({ src: reader.result })
          );
          reader.readAsDataURL(this.state.files[0]);
        }
  }
  
  onImageLoaded = image => {
    this.imageRef = image;
    //console.log("img load url",image)
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    //console.log(crop)
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
if (this.imageRef && crop.width && crop.height) {
  //console.log('hi',this.imageRef)
  const croppedImageUrl = await this.getCroppedImg(
    this.imageRef,
    crop,
    'newFile.jpeg'
  );
  this.setState({ croppedImageUrl });
  //console.log(croppedImageUrl)
}
}
getCroppedImg(image, crop, fileName) {
  //console.log("test image",image)
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        //console.log(blob)
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
}
reset=()=>{
  //console.log("hi")
  this.setState({
    src:null,
    files:[],
    name:"",
    age:"",
    croppedImageUrl:null,
    modal:true,
    saveImage:false
  })
  
  //this.hideShow()
}
changeCrop=()=>{
//   this.setState(prevState => ({
//     modal: !prevState.modal,
//  }));
  console.log("hi");
  this.setState({
    modal:true
  })
}
hideShow=()=>{
  
  if(this.state.files.length<=0 && this.state.saveImage===false){
    //console.log("hi")
    return(
      <div {...this.props}>
      <StyledDropZone onDrop={this.addFile} />
      </div>
    )
  }else{ 
    return(
      <>
      <Modal show={this.state.modal} onHide={this.showImgDiv}>
        <div className="p-1"> <i className="fa fa-close modalClose" onClick={this.showImgDiv}></i></div>
        <div className="p-3">
        {
          this.state.files.map(file =>
          <div key="a">
          {/* {console.log(file.name)} */}
          {this.state.src && (
            <ReactCrop
              src={this.state.src}
              crop={this.state.crop}
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          )}
          <div><center>
          <Button className="m-2" variant="outline-success" onClick={this.saveImageDiv}>crop Image</Button> 
            </center></div>
          </div>
          )
          }
        </div> 
        </Modal>
        <div className={this.state.show}>
        {this.cropImage()}
        </div>
      </>
    )
    //console.log("byy")
  }
}
saveImageDiv=()=>{
  this.setState({
    modal:false,
    saveImage:true
  })
}
showImgDiv=()=>{
  //e.preventDefault();
  if(this.state.saveImage===false){
  this.setState({
    modal:false,
    saveImage:false,
    files:[],
    src:null,
    croppedImageUrl:null
  })
}
else{
  this.setState({
    modal:false
  })
}
}
cropImage=()=>{
  if(this.state.modal===false && this.state.saveImage===true){
  return(
    <>
    {this.state.croppedImageUrl && (
      <div className="con">
        <img alt="Crop" style={{ maxWidth: '100%' }} src={this.state.croppedImageUrl} />
          <div className="overlay" style={{ maxWidth: '100%' }}></div>
          <div className="button"> 
            <i className="fa fa-close" onClick={this.reset}></i>
            <i className="fa fa-crop" onClick={this.changeCrop}></i>
          </div>
        </div>
      )}
    </>
  )
  }
  else{
    return(
    <div>
      <StyledDropZone {...this.props} onDrop={this.addFile} />
      </div>
    )
  }
}
tabaleShow=()=>{
  if(this.state.imageArray.length>0){
  return(
    <Table className="mt-2" striped bordered hover size="sm">
        <thead>
        <tr>
        <th>
            Name:
          </th>
          <th>
            Age:
          </th>
          <th>
            Gender:
          </th>
          <th>
            Image:
          </th>
        </tr>
        </thead>
        <tbody>
        {
          this.state.imageArray.map((val,index)=>{return(
          <tr key={index}>
            <td>{val.name}</td>
            <td>{val.age}</td>
            <td>{val.gender}</td>
            <td><img className="ImageStyle" src={val.image} alt={val.name}/></td>
          </tr>
           )
          })}
        </tbody>
      </Table>
  )
  }
  else{
    return(
      <></>
    )
  }
}
  render(){
    //const {  croppedImageUrl } = this.state;
    console.log(this.state.modal)
  return (
    <Container>
      {/* <div onClick={e=>this.showImgDiv(e)}> */}
      <Form encType="multipart/form-data" onSubmit={this.filesubmit}>
        <Row className="mt-3">
          <Col sm={6}>
            <Row>
              <Form.Label>Name:</Form.Label>
            </Row>
            <Row>
              <Form.Control placeholder="Name" name="name" value={this.state.name} onChange={(e)=>this.handleChange(e)}/>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Form.Label>Age:</Form.Label>
            </Row>
            <Row>
              <Form.Control placeholder="Age" name="age" value={this.state.age} onChange={(e)=>this.handleChange(e)}/>
            </Row>
          </Col>  
        </Row>
        
        <Row className="mt-3">
          <Col sm={6}>
            <Row>
              <Form.Label>Profile:</Form.Label>
            </Row>
            <Row>
              {this.hideShow()}
            </Row>
            <Row>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Form.Label>Gender:</Form.Label>
            </Row>
            <Row>
              <Col sm={2}>
                <Form.Check className="pl-0" type="radio" label="Male" value="male" checked={this.state.selectedOption === 'male'} onChange={(e)=>this.handleChange(e)}/>
              </Col>
              <Col sm={2}>
                <Form.Check className="pl-0" type="radio" label="Female" value="female" checked={this.state.selectedOption === 'female'} onChange={(e)=>this.handleChange(e)}/>
              </Col> 
            </Row>
          </Col>  
        </Row>
        <Row className="mt-3">
        <Col>
            <Row>
            <Button variant="outline-success" type="submit" onClick={this.dataSubmit}>Submit</Button>
            <Button className="ml-2" variant="outline-secondary" type="reset" onClick={this.reset}>Reset</Button>
            </Row>
          </Col>
        </Row>
      </Form>
      
      {this.tabaleShow()}
      {/* </div> */}
    </Container>
  );
}
}
export default App;
