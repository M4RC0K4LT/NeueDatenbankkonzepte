/** 
 * Function to request Express Backend to delete users`s profile picture
 * @returns {JSON} successful or not.
 */
export default function deleteProfilePicture(){

    return (
        fetch(window.$apiroute + '/user/delProfilePic', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")},
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Delete ProfilePic: " + error.message) + '}'))
    )
}