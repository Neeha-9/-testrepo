import React from "react";
import "./App.css";
import {
  Card,
  Container,
  Row,
  Col,
  Media,
  Spinner,
  Button
} from "react-bootstrap";
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";
const apiKey = "SzzwgIFn9VizXYR_qj1Cj6v2CAF0CdrMZET_7vn7gkYwV4AynE1nWamm9--vNP2wLmHFHPYPV5wd-Q1rSqvJPOb_QhJzXmIGNVN1sUkb7TJGEfx9A5OfY42y2DZEXnYx";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      dataResponse: [],
      reviewsResponseData: [],
      isLoading: false,
      selectedId: "",
      loaderreview: false,
      config: {
        headers: { Authorization: `Bearer ${apiKey}` },
        params: {
          term: "top 5 icecream shops",
          limit: 5,
          sort_by: "review_count",
          categories: "icecream",
          location: "Alpharetta, GA"
        }
      },
      firstLoad: true
    };
  }
  componentWillMount() {
    axios
      .get(
        `${"https://cors-anywhere.herokuapp.com/"}https://api.yelp.com/v3/businesses/search`,
        this.state.config
      )
      .then(response => {
        if (response.status) {
          this.setState({
            dataResponse: response.data.businesses,
            isLoading: false,
            firstLoad: false
          });
        }
      });
  }
  componentDidMount() {}

  showReview = e => {
    if (this.state.selectedId === e) {
      this.setState({
        selectedId: ""
      });
    } else {
      this.setState({
        selectedId: e,
        loaderreview: true
      });
    }

    axios
      .get(
        `${"https://cors-anywhere.herokuapp.com/"}https://api.yelp.com/v3/businesses/${e}/reviews`,
        this.state.config
      )
      .then(response => {
        if (response.status) {
          this.setState({
            reviewsResponseData: response.data.reviews,
            loaderreview: false
          });
        }
      });
  };
  loadmoreData = e => {
    let config = this.state.config;
    config.params.limit += 3;
    this.setState({
      isLoading: true,
      config
    });
    axios
      .get(
        `${"https://cors-anywhere.herokuapp.com/"}https://api.yelp.com/v3/businesses/search`,
        config
      )
      .then(response => {
        if (response.status) {
          this.setState({
            dataResponse: response.data.businesses,
            isLoading: false
          });
        }
      });
  };
  render() {
    const { isLoading } = this.state;

    return (
      <div>
        {this.state.firstLoad === true ? (
          <div style={{ textAlign: "center", marginTop: "150px" }}>
            <Spinner
              animation="border"
              variant="primary"
              height={500}
            ></Spinner>
          </div>
        ) : (
          ""
        )}
        <Container>
          <Row style={{ marginTop: "15px" }}>
            {this.state.dataResponse.map((data, index) => (
              <Col xs={4} md={4}>
                <React.Fragment>
                  <Card
                    style={{ width: "18rem", marginBottom: "15px" }}
                    key={data.id}
                  >
                    <Card.Img variant="top" height={230} src={data.image_url} />
                    <Card.Body>
                      <Card.Title>{data.name}</Card.Title>
                      <Card.Text>
                        {data.location.display_address.join(" ")}
                      </Card.Text>
                      <Card.Text>Phone : {data.display_phone}</Card.Text>
                      <Card.Text></Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div style={{ float: "left" }}>
                        <StarRatingComponent
                          name="rate1"
                          starCount={5}
                          value={data.rating}
                          style={{ float: "left" }}
                        />
                      </div>
                      <div style={{ float: "left" }}>({data.review_count})</div>
                      <div>
                        <Card.Link
                          onClick={() => this.showReview(data.id)}
                          style={{
                            color: "#007bff",
                            cursor: "pointer",
                            paddingLeft: "3px"
                          }}
                        >
                          See all user reviews
                        </Card.Link>
                      </div>
                      <br />

                      {data.id === this.state.selectedId ? (
                        <React.Fragment>
                          {this.state.loaderreview === true ? (
                            <Spinner
                              animation="border"
                              variant="primary"
                            ></Spinner>
                          ) : (
                            <React.Fragment>
                              {this.state.reviewsResponseData.map(
                                (data, index) => (
                                  <ul className="list-unstyled">
                                    <Media as="li">
                                      <img
                                        width={64}
                                        height={64}
                                        className="mr-3"
                                        src={data.user.image_url}
                                        alt={data.user.name}
                                      />
                                      <Media.Body>
                                        <h5>{data.user.name}</h5>
                                        <p>{data.text}</p>
                                      </Media.Body>
                                    </Media>
                                  </ul>
                                )
                              )}
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      ) : (
                        ""
                      )}
                    </Card.Footer>
                  </Card>
                </React.Fragment>
              </Col>
            ))}
            {/* {this.state.dataResponse.length > 0 ? (
              <Row>
                <Col xs={12} md={12}>
                  <Button
                    variant="primary"
                    disabled={isLoading}
                    onClick={this.loadmoreData}
                    style={{ marginLeft: "15px" }}
                  >
                    {isLoading ? "Loading…" : "Show more"}
                  </Button>
                </Col>
              </Row>
            ) : (
              ""
            )} */}
          </Row>
        </Container>
      </div>
    );
  }
}
