import React, { Component } from 'react';
import { Carousel } from 'antd';

export default class CarouselItems extends Component {

    renderItems() {
        let carouselItemArr = [];
        // Add the image to our existing div.
        for(let i = 8; i<16;i++) {
            carouselItemArr.push((<div className={`bg-${i}`} key={i}></div>));
        }
        // carouselItemArr.forEach((item) => (<div key={item}><img src={`../styles/images/${item}`} /></div>));
        return carouselItemArr;
    }
    render() {
        return null
        // return (
        //     <Carousel autoplay>
        //         {this.renderItems()}
        //     </Carousel>
        // );
    }
}
