/** 
 * Function to request Express Backend and return JSON - Change/Upload profile picture
 * @param {FormData} img User´s new profile picture.
 * @returns {JSON} successful or not.
 */
export default function postProfilePicture(img){

    return (
        fetch(window.$apiroute + '/user/profilePicForm', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")},
            body: img
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Upload ProfilePic: " + error.message) + '}'))
    )
}