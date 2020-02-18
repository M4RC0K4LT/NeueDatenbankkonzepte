/** 
 * Function to request Express Backend and return JSON - Send existing userdata -> Used on login
 * @returns {JSON} Userdata with AuthToken.
 */
export default function getUserInformation(id){

    return (
        fetch(window.$apiroute + "/user/getdata/" + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "User: " + error.message) + '}'))
    )
}