import * as _ from "lodash";
import * as React from "react";

interface RequestProps {
  /* URL to request. */
  url: string;

  /* Request options for fetch. */
  init?: RequestInit;
}

interface ResponseState<Data> {
  /* Response data. */
  data?: Data;

  /* Error status and message. */
  ok: boolean;
  message?: string;
}

/** Display response to HTTP request as React component.

 This higher-order component makes an HTTP request and displays the response
 data (assumed to be JSON). It simplifies the common CRUD pattern where a
 REST API call is mapped onto a component.
*/
export function displayResponseData<Props, Data>(
  ResponseComponent: React.ComponentType<Props & { data?: Data }>
) {
  return class extends React.Component<
    Props & RequestProps,
    ResponseState<Data>
  > {
    constructor(props: Props & RequestProps) {
      super(props);
      this.state = { ok: true };
    }

    componentDidMount() {
      this.request(this.props);
    }
    componentDidUpdate(prevProps: RequestProps) {
      if (!_.isEqual(this.props, prevProps)) {
        this.request(this.props);
      }
    }

    request(props: RequestProps) {
      fetch(props.url, props.init)
        .then(response => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then(data => {
          this.setState({ data, ok: true });
        })
        .catch(reason => {
          this.setState({ data: undefined, ok: false, message: reason });
        });
    }

    render() {
      if (!this.state.ok) {
        console.error(
          `Request to ${this.props.url} failed: ${this.state.message}`
        );
        return null;
      }
      // XXX: Should remove RequestProps via spread.
      // https://github.com/Microsoft/TypeScript/issues/10727
      return <ResponseComponent {...this.props} data={this.state.data} />;
    }
  };
}
