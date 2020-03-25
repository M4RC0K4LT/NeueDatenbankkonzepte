/** 
 * Function to request Express Backend and return JSON - Upload a picture to post
 * @param {FormData} img Image included in form.
 * @returns {JSON} successful or not.
 */
export default function postPostPicture(img){

    return (
        fetch(window.$apiroute + '/user/postPicForm', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")},
            body: img
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Upload PostPic: " + error.message) + '}'))
    )
}