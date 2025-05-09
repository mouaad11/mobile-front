import {Image, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import Colors from "@/constant/Colors";
import { router } from "expo-router";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor:Colors.WHITE
      }}
    >
        <Image source={require('./../assets/images/ensabLogo.jpg')}
            style={{
                width:'100%',
                height:300,

            }}
               resizeMode="contain" />

        <View  style={{
            padding:25,
            backgroundColor:Colors.PRIMARY,
            height:'100%',
            borderTopLeftRadius:35,
            borderTopRightRadius:35
        }}>
           <Text style={{
               fontSize:30,
               fontFamily:'bold',
               textAlign:'center',
               color:Colors.WHITE
           }}>welcome to our react native app </Text>

            <Text style={{
                fontSize:15,
                color:Colors.WHITE,
                marginTop:20,
                fontFamily:'regular',
                textAlign:'center'
            }}>
                c'est un projet de devloppement mobile dans
                lequel on va creer une appication full stack
            </Text>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => router.push('/register')}
            >
                <Text style={[styles.buttonText,{color:Colors.PRIMARY,fontFamily:'regular' }]}>Inscription</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button,{
                    backgroundColor: Colors.PRIMARY,
                    borderWidth:1,
                    borderColor:Colors.WHITE
                }]}
                onPress={() => router.push('/login')}
            >
                <Text style={[styles.buttonText,{color:Colors.WHITE,fontFamily:'regular'}]}>Connexion</Text>
            </TouchableOpacity>

        </View>

    </View>
  );
}

const styles=StyleSheet.create({
    button:{
        padding:15 ,
        backgroundColor:Colors.WHITE,
        marginTop:20,
        borderRadius:15
    },
    buttonText:{
        textAlign:'center',
        fontSize:14,


    }
})
