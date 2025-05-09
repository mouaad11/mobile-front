# Correction des erreurs de réseau dans l'application

## Problème résolu

L'application affichait une erreur de type "Error: network" lors des tentatives de connexion ou d'inscription. Ce problème était dû à une gestion insuffisante des erreurs réseau lors des appels API vers le backend.

## Modifications apportées

### 1. Amélioration de la gestion des erreurs dans login.tsx

La fonction `handleLogin` a été modifiée pour détecter spécifiquement les erreurs de réseau et afficher un message plus informatif à l'utilisateur.

```javascript
catch (error) {
  console.error('Login error:', error);
  
  // Check if it's a network error
  if (error instanceof TypeError && error.message.includes('Network request failed')) {
    Alert.alert(
      'Erreur de connexion',
      'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et que le serveur backend est en cours d\'exécution.'
    );
  } else {
    Alert.alert('Erreur', 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
  }
}
```

### 2. Amélioration de la gestion des erreurs dans register.tsx

La même amélioration a été apportée à la fonction `handleRegister` pour détecter les erreurs de réseau lors de l'inscription.

## Comment résoudre les erreurs de réseau

Si vous rencontrez toujours l'erreur "Error: network" lors de la connexion ou de l'inscription, voici les étapes à suivre :

1. **Vérifiez que le serveur backend est en cours d'exécution**
   - Assurez-vous que votre serveur Spring Boot est démarré et fonctionne correctement
   - Vérifiez qu'il est accessible sur le port 8080

2. **Vérifiez votre connexion internet**
   - Assurez-vous que votre appareil ou émulateur est connecté à internet
   - Si vous utilisez un émulateur, vérifiez que l'émulateur a accès à internet

3. **Vérifiez l'adresse IP du serveur**
   - L'application utilise `10.0.2.2:8080` pour se connecter au backend
   - Cette adresse est utilisée par les émulateurs Android pour accéder à localhost sur la machine hôte
   - Si vous testez sur un appareil physique ou si votre backend n'est pas sur localhost, vous devrez modifier cette adresse

4. **Vérifiez les pare-feu et les restrictions réseau**
   - Assurez-vous qu'aucun pare-feu ne bloque les connexions au port 8080
   - Vérifiez que votre réseau n'a pas de restrictions qui empêchent l'accès au serveur

## Modification de l'adresse du serveur backend

Si votre serveur backend n'est pas accessible à l'adresse `10.0.2.2:8080`, vous devrez modifier cette adresse dans les fichiers suivants :

1. `app/login.tsx` - Ligne 50
2. `app/register.tsx` - Ligne 85
3. `app/home.tsx` - Ligne 56
4. `app/movie/[id].tsx` - Ligne 58
5. `app/watchlists.tsx` - Ligne 46

Remplacez `10.0.2.2:8080` par l'adresse IP et le port corrects de votre serveur backend.