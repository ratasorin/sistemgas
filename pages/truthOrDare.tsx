import type { NextPage } from 'next';

const TruthOrDare = ({response} : {response : {textByLine : string[]}}) => {

    const validQuestions = response.textByLine.filter(text => text.at(0))
    console.log(validQuestions);
    return <div>
    </div>
}

export async function getStaticProps() {

    const everything = await fetch ("http://localhost:3000/api/truthOrDare");
    console.log(everything)
    const response = await everything.json();
    return {
      props: {response}, // will be passed to the page component as props
    }
  }

export default TruthOrDare;