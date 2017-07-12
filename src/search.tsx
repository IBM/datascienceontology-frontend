import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Cloudant from "./cloudant";

import { IConcept } from "./models/concept";


interface ISearchProps {
  db: string;
  query: string;
}
interface ISearchState {
  concepts: Array<IConcept>;
}

export class SearchResults extends React.Component<ISearchProps,ISearchState> {
  constructor(props: ISearchProps) {
    super(props);
    this.state = {
      concepts: []
    }
  }
  
  componentWillMount() {
    
  }
  
}

interface ISearchBarProps {
  defaultQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

/** A generic search bar.

  Implemented as an "uncontrolled component", in the React jargon.
*/
export class SearchBar extends React.Component<ISearchBarProps,{}> {
  private query: string;
  
  constructor(props: ISearchBarProps) {
    super(props);
    this.query = this.props.defaultQuery || "";
  }
  
  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.props.onSearch && this.query) {
      this.props.onSearch(this.query);
    }
  }
  
  render() {
    return <div className="search-bar">
      <form onSubmit={this.onSubmit}>
        <input ref={(input) => this.query = input.value}
               defaultValue={this.props.defaultQuery}
               placeholder={this.props.placeholder} />
        <input type="submit" value="Submit" />
      </form>
    </div>;
  }
}
