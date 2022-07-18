import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component"



export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: '10',
    category: "general"
  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string

  }
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    // console.log('super fire'); // for  debugging
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResult:0 //for infinite scroll use this logic either not this line
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsWorld`
  }
  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parseData = await data.json();
    this.props.setProgress(50);
    // console.log(parseData);
    this.setState({
      articles: parseData.articles,
      totalResults: parseData.totalResults,
      loading: false
    })
    this.props.setProgress(100);
  }
  async componentDidMount() {
    // console.log('render ke bad')//for debugging
    // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=4454c458cbe745018245118ae45b82a3&page=1&pageSize=${this.props.pageSize}`;
    // this.setState({loading:true});
    // let data=await fetch(url);
    // let parseData=await data.json();
    // console.log(parseData);
    // this.setState({articles:parseData.articles,
    //   totalResults:parseData.totalResults,
    //   loading:false
    // })
    this.updateNews();
  }

  // for infinite scroll use thats why disable after handelprevclick,if use next switch active this
  
  // handelPrevclick = async () => {
  //   // console.log('previous');
  //   // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=4454c458cbe745018245118ae45b82a3&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
  //   // this.setState({loading:true});
  //   // let data=await fetch(url);
  //   // let parseData=await data.json();
  //   // console.log(parseData);
  //   // this.setState({
  //   //   page:this.state.page-1,
  //   //   articles:parseData.articles,
  //   //   loading:false
  //   // })
  //   this.setState({ page: this.state.page - 1 });
  //   this.updateNews();
  // }
  // for infinite scroll use thats why disable after handelNextclick,if use next switch active this

  // handelNextclick = async () => {
  //   // console.log('next');
  //   this.setState({ page: this.state.page + 1 });
  //   this.updateNews();
  // }
//this use for scrollinfinite
  fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
    this.setState({page:this.state.page+1})
    let data = await fetch(url);
    let parseData = await data.json();
    // console.log(parseData);
    this.setState({
      articles: this.state.articles.concat(parseData.articles),
      totalResults: parseData.totalResults
    })
   
  };


  render() {
    return (
      // when use next and prev use a div after this line
      <>
        <h1 className="text-center" style={{ margin: '35px 0px',marginTop:'90px' }}>NewsWorld-Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>

        {this.state.loading && <Spinner/>}
        {/* infinitescrool use here if use next button you can not write this */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!==this.state.totalResult}
          loader={<Spinner/>}
        >
          {/* after 1 st div use for infinite scroll */}
          <div className="container">
          <div className="row my-3">
            {/* !this.state.loading && this.state.articles.map((element)=>//add when next and previous logic use */}
            {this.state.articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title.slice(0, 40) : ""} description={element.description ? element.description.slice(0, 80) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
            </div>
          </div>
        </InfiniteScroll>
        {/* for infinite scroll use thats why disable after div,if use next active thid div */}

        {/* <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handelPrevclick}>&larr;Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResult / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handelNextclick}>Next &rarr;</button>
        </div> */}
      </>
    )
  }

}
export default News
