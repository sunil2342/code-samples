import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../utils/Fonts';
module.exports =  StyleSheet.create({
  containerStyle: {
    shadowColor: '#999999',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 10.27,
    elevation: 3,
    width: "86%", marginLeft: "7%",marginRight: "7%", marginTop: 5,
  },
  LoginVia:
  {
    fontSize: 14,
    color: '#7f7f7f',
    fontFamily: Fonts.Cairo,
  },
  logo:
  {
    width: 70,
    height:70
  },
  LoginSocial:
  {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
Row:
{
  flex: 1,
  left:0,
  top: 10,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
},
RowSpec:
{
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},
AgreeRowSpec:
{
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flex:1,
  right:10,
  marginTop:5,
  marginBottom:20,
},
account:
{
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop:15,
  marginBottom:150
},
marginSpecAll:
{
  marginTop: 10,
  marginBottom: 15,
  width: "100%"
},
btnStyle: {
  borderRadius: 0,
  marginVertical: 0,
  backgroundColor: "#ff6600",
  fontSize:16,
  fontWeight: "bold",
  fontFamily:Fonts.Cairo,
},
iconContainer:
{
  flex:1,
  justifyContent: 'center',
  alignItems: 'center',
  top:40,
  zIndex: 2
},
marginSpec:
{
   marginTop:40
},
inputSpec:
{
  fontFamily:Fonts.Cairo,
  flexDirection: 'row',
  textAlign: 'right',
  color: "#7f7f7f",
  height:40,
  fontSize:14,
},
aligned:
{
  justifyContent: 'center',
  alignItems: 'center',
},
deviderRight:
{
  marginTop:2,
  borderBottomWidth: 1,
  marginLeft: 3,
  borderBottomColor: '#cccccc',
  width: 50,
},
deviderLeft:
{
  marginTop:2,
  borderBottomWidth: 1,
  marginRight: 3,
  borderBottomColor: '#cccccc',
  width: 50,
},
iconSpec:
{
  fontSize:20,
  paddingTop:4,
  paddingRight:1,
  color:"#cccccc",
}
})
