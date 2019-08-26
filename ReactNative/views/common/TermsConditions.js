import React, { Component } from "react";
import { translate } from 'react-i18next';
import i18next from 'i18next';
//Import Global Styles
import { Fonts } from '../../utils/Fonts';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
export class TermsConditions extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t('terms_conditions:title'),
    headerStyle: {
      backgroundColor: '#302f2f',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize:15,
      fontFamily:Fonts.Cairo,
    },
  });
  render() {
    const { t, i18n, navigation } = this.props;
    const { navigate } = navigation;
    if( i18next.language === 'ar')
    {
      return (
        <Container>
          <Content padder>
            <Card transparent>
              <CardItem>
                <Body>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                  <Text>
                    أبجد هوز هو نص زائف اللاتينية المستخدمة في تصميم المواقع ،
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>
      );
    }
    else
    {
      return (
        <Container>
          <Content padder>
            <Card transparent>
              <CardItem>
                <Body>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                <Text>
                  Lorem ipsum is a pseudo-Latin text used in web design,
                </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>
      );
    }

  }
}
export default translate(['terms_conditions', 'common'], { wait: true })(TermsConditions);
