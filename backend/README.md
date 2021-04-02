# SoPekocko -

Création d'un backend pour une application de notation de sauce


## Version utilisé:

Version de mongoose:   mongoose@5.11.15   
Node version : v14.16.0

Ajout de 'Helmet' vous aide à protéger votre application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.


### Securite: 

Helmet pour le Xss
Dotenv afin de masquer les donneées sensible
Express rate limit pour une limitation des requetes 
Mongo interceptor afin de se proteger des injections dans la base de donnée 
OWASP Password Strength afin d'assurer la securiter et la force du mdp


#### Demarrage du serveur : 

Pour demarrer le serveur : nodemon server