/** 
 * Function to request Express Backend and return JSON - Send follow request
 * @param {string} actingUser User´s ID.
 * @param {string} watchedUser Watched User´s ID.
 * @returns {JSON} successful or not.
 */
export default function postFollow(actingUser, watchedUser){

    return (
        fetch(window.$apiroute + '/user/follow', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "myid": actingUser,
                "otherid": watchedUser
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Following: " + error.message) + '}'))
    )
}