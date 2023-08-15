import loaderUtil from 'loader-utils';
export default function(source){
    console.log(source);
    const option = loaderUtil.getOption(this);
}