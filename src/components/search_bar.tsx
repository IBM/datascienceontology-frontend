import * as React from "react";
import { Form, FormControl, InputGroup, Button } from "react-bootstrap";

interface SearchBarProps {
  defaultQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}
interface SearchBarState {
  query: string;
}

export class SearchBar extends React.Component<SearchBarProps,SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = {
      query: props.defaultQuery || ""
    };
  }
  
  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.props.onSearch && this.state.query) {
      this.props.onSearch(this.state.query);
    }
  }
  
  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({query: event.target.value});
  }
  
  render() {
    // XXX: Typecast to `any` required by bug in react-bootstrap typings:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16208
    return <div className="search-bar">
      <Form onSubmit={(e) => this.onSubmit(e as any)}>
        <InputGroup>
          <FormControl type="text" value={this.state.query}
                       placeholder={this.props.placeholder}
                       onChange={(e) => this.onChange(e as any)} />
          <InputGroup.Button>
            <Button type="submit">Search</Button>
          </InputGroup.Button>
        </InputGroup>
      </Form>
    </div>;
  }
}
