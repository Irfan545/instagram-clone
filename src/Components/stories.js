import IMG from '../profile.jpg'
const Stories = () => {
    return (
        <div className='story-div'>
          <div className='story'>
              <img src={IMG} alt='img'/>
              <div className='story-name'>
              <p>name</p>
              </div>
          </div>
      </div>
      );
}
 
export default Stories;