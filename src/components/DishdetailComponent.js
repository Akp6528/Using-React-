import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody, Button, Row, Col, Label } from "reactstrap";
import { Control, LocalForm, Errors } from "react-redux-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";  
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
function RenderDish({dish}) {

    return (

        <div className='col-12 col-md-5 m-1'>
            <Card>
            <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({ comments, postComment, dishId }) {

    if (comments != null)
        return (
            <div className="col-12 col-md-5 m-1">
                <h4> Comments </h4>
                <ul className="list-unstyled">
                    { comments.map((comment) => {
                        return (
                            <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author},
                                &nbsp;
                                {new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(comment.date))}
                                </p>
                            </li>
                        );
                    })}        
                </ul>
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        );
    else
        return (
            <div></div>
        );

}


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);
      
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      

        this.state = {
            isNavOpen: false,
            isModalOpen: false
        };
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
      this.toggleModal();
      this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }
    render() {
        return (
          <div>
            <button
              className="btn btn-light border border-dark" onClick={this.toggleModal}>
              <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon> &nbsp; Submit Comment
            </button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
              <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
              <ModalBody>
                <LocalForm onSubmit={values => this.handleSubmit(values)}>
                 
                  <Row className="form-group">
                    <Label htmlFor="rating" md={12}>
                      Rating
                    </Label>
                    <Col md={12}>
                      <Control.select
                        model=".rating"
                        id=".rating"
                        name=".rating"
                        className="form-control">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </Control.select>
                    </Col>
                  </Row>

                  <Row className="form-group">
                    <Label htmlFor="author" md={12}>
                      Your Name
                    </Label>
                    <Col md={12}>
                      <Control.text
                        model=".author"
                        id="author"
                        name="author"
                        placeholder="Your Name"
                        className="form-control"
                        validators={{ required, minLength: minLength(3), maxLength: maxLength(15)}} />
                      <Errors
                        className="text-danger" model=".name" show="touched"
                        messages={{
                          required: "Required ",
                          minLength: "Must be greater than 2 characters",
                          maxLength: "Must be 15 characters or less"
                        }}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group">
                    <Label htmlFor="comment" md={12}>
                      Comment
                    </Label>
                    <Col md={12}>
                      <Control.textarea
                        model=".comment"
                        id="comment"
                        name="comment"
                        rows="6"
                        className="form-control"
                      />
                    </Col>
                  </Row>


                  <Row className="form-group">
                    <Col md={{ size: 10 }}>
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </LocalForm>
              </ModalBody>
            </Modal>
          </div>
        );
      }
}


const Dishdetail = (props) => {
  
  if (props.isLoading) {
    return(
        <div className="container">
            <div className="row">            
                <Loading />
            </div>
        </div>
    );
}
else if (props.errMess) {
    return(
        <div className="container">
            <div className="row">            
                <h4>{props.errMess}</h4>
            </div>
        </div>
    );
}
else if (props.dish != null) 
    return (
          <div className="container">
              <div className="row">
                  <Breadcrumb>
                      <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>

                      <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>

                  </Breadcrumb>
                  <div className="col-12">
                      <h3>{props.dish.name}</h3>
                      <hr />
                  </div>
              </div>
              <div className="row">
                  <RenderDish dish={props.dish} />
                  <RenderComments comments={props.comments}
                    postComment={props.postComment}
                    dishId={props.dish.id} />
              </div>
          </div>
      );
  else
      return (
          <div></div>
      );
}


export default Dishdetail;




