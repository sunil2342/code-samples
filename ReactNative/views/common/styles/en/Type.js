import { StyleSheet } from 'react-native';

module.exports =  StyleSheet.create({
  containerStyle: {
    shadowColor: '#999999',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 10.27,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    width: 276, marginLeft: 22,marginRight: 22,
  },
  LoginVia:
  {
    fontSize: 14,
    color: '#7f7f7f',
    //fontFamily: Fonts.Cairo,
  },
  logo:
  {
    width: 82,
    height:82
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
  marginTop:0,
},
language:
{
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop:40,
  marginBottom:20,
  width: '100%',
},
marginSpecAll:
{
  marginTop: 0,
  marginBottom: 15,
  width: "100%"
},

MainContainer:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: "100%",
        resizeMode: 'cover',
        flexDirection: 'column',
    },
})
